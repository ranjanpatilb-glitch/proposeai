import Anthropic from 'anthropic'
import { SYSTEM_PROMPT, buildUserPrompt } from '../../../lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { intake } = await req.json()
    if (!intake?.clientName || !intake?.projectType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(intake) }],
    })

    const raw = message.content[0]?.text || ''
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const proposal = JSON.parse(cleaned)

    return Response.json({ proposal })
  } catch (err) {
    console.error('Generate error:', err)
    return Response.json({ error: err.message || 'Failed to generate proposal' }, { status: 500 })
  }
}
