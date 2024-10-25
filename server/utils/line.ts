import { H3Event } from 'h3'

export async function sendLineNotification(message: string, event: H3Event) {
  const config = useRuntimeConfig(event)
  
  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${config.lineNotifyToken}`
      },
      body: new URLSearchParams({ message })
    })
    
    if (!response.ok) {
      throw new Error(`Line Notify 請求失敗: ${response.statusText}`)
    }
    
    console.log('Line 通知發送成功')
    return true
  } catch (error) {
    console.error('Line 通知發送失敗:', error)
    return false
  }
}