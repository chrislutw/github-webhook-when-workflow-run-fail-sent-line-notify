interface WorkflowRun {
  conclusion: string
  name: string
  head_branch: string
  html_url: string
}

interface Repository {
  full_name: string
}

export interface GitHubWebhookPayload {
  workflow_run?: WorkflowRun
  repository: Repository
}

export function createFailureMessage(payload: GitHubWebhookPayload): string {
  return `
🔴 工作流程失敗
儲存庫: ${payload.repository.full_name}
工作流程: ${payload.workflow_run?.name}
分支: ${payload.workflow_run?.head_branch}
詳細資訊: ${payload.workflow_run?.html_url}
  `.trim()
}

export function isWorkflowFailure(payload: GitHubWebhookPayload): boolean {
  return Boolean(
    payload.workflow_run && 
    payload.workflow_run.conclusion === 'failure'
  )
}