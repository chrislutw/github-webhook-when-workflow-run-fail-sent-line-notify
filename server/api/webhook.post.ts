import { defineEventHandler, readBody } from 'h3'
import { sendLineNotification } from '../utils/line'
import { 
  GitHubWebhookPayload, 
  isWorkflowFailure, 
  createFailureMessage 
} from '../utils/github'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as GitHubWebhookPayload
    console.log('收到 GitHub webhook 資料:', JSON.stringify(body, null, 2))
    
    if (!isWorkflowFailure(body)) {
      console.log('收到事件但不需要處理（非失敗的工作流程）')
      return { success: true, message: '事件已接收，無需處理' }
    }

    console.log('工作流程失敗，準備發送 Line 通知...')
    const message = createFailureMessage(body)
    console.log('準備發送的訊息:', message)

    const notificationSent = await sendLineNotification(message, event)
    
    return notificationSent 
      ? { success: true, message: '通知已發送' }
      : { success: false, error: '發送通知時發生錯誤' }
  } catch (error) {
    console.error('Webhook 處理錯誤:', error)
    return { success: false, error: '內部伺服器錯誤' }
  }
})