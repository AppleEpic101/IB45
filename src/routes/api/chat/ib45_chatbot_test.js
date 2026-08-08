cd ~/dev/IB45
cat > test-openai.mjs << 'EOF'
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

try {
	const res = await openai.chat.completions.create({
		model: 'gpt-4o',
		max_tokens: 20,
		messages: [{ role: 'user', content: 'Say hello in 3 words.' }]
	});
	console.log('SUCCESS:', res.choices[0].message.content);
} catch (e) {
	console.error('FAILED:', e);
}
EOF
node test-openai.mjs