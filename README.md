# Lavanya Dynamic Mood Scanner (Groq)

This is the version for:
- dynamic fresh reply every time
- mood + typed reason
- Dhanesh-side tone
- simple Lavanya-only unlock
- camera preview

## Setup

1. Install Node.js on your computer
2. Open this folder in terminal
3. Run:

```bash
npm install
```

4. Set your Groq key

### Windows PowerShell
```powershell
setx GROQ_API_KEY "your_new_groq_key_here"
```

### macOS / Linux
```bash
export GROQ_API_KEY="your_new_groq_key_here"
```

5. Start server

```bash
npm start
```

6. Open in browser

```text
http://localhost:3000
```

## Important

- Do not paste the Groq key into frontend code.
- Keep it only in environment variables.
- If you pasted your old key in chat or anywhere public, rotate it first.
