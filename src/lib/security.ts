export function logSystemEvent(tipo_erro: string, mensagem: string, user_id?: string) {
  try {
    const logs = JSON.parse(localStorage.getItem('db_logs_sistema') || '[]')
    logs.push({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      user_id: user_id || 'anonymous',
      tipo_erro,
      mensagem,
    })
    localStorage.setItem('db_logs_sistema', JSON.stringify(logs))
    console.warn(`[Security Log] ${tipo_erro}: ${mensagem}`)
  } catch (e) {
    console.error('Falha ao registrar log de sistema', e)
  }
}

export function checkRateLimit(
  action: string,
  identifier: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const key = `rl_${action}_${identifier}`
  const now = Date.now()
  try {
    const records = JSON.parse(localStorage.getItem(key) || '[]')
    const validRecords = records.filter((timestamp: number) => now - timestamp < windowMs)

    if (validRecords.length >= maxRequests) {
      logSystemEvent('RATE_LIMIT', `Limite de requisições excedido para ${action}`, identifier)
      return false
    }

    validRecords.push(now)
    localStorage.setItem(key, JSON.stringify(validRecords))
    return true
  } catch (e) {
    return true // Fail open to avoid blocking legitimate users if storage fails
  }
}
