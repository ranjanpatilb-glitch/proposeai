import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { sectionId, sectionTitle, intake, instruction } = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are an expert proposal writer. Rewrite ONLY the "${sectionTitle}" section for this proposal.
Client: ${intake.clientName}, Project: ${intake.projectType}, Tone: ${intake.tone || 'professional'}.
Agency: ${intake.agencyName}.
${instruction ? 'Special instruction: ' + instruction : ''}
Return ONLY a single JSON object (no markdown fences):
{"id": "${sectionId}", "title": "${sectionTitle}", "content": "..."}`,
      }],
    })

    const raw = message.content[0]?.text.replace(/```json|```/g, '').trim()
    const section = JSON.parse(raw)
    return Response.json({ section })
  } catch (err) {
    console.error('Regen error:', err)
    return Response.json({ error: err.message || 'Failed to regenerate' }, { status: 500 })
  }
}
