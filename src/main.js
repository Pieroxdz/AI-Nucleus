import './index.css'
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { streamText } from "ai"

// --- Configuración ---
const openrouter = createOpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_KEY
})

// --- Referencias al DOM ---
const form = document.querySelector("#form")
const prompt = document.querySelector("#prompt")
const response = document.querySelector("#app")
const submitBtn = document.querySelector("#form button")

// --- Estado ---
const obj = {
  prompt: ""
}

// --- Funciones ---
const sincronizarData = (e) => {
  obj[e.target.name] = e.target.value
}

const generarRespuesta = async () => {
  const result = streamText({
    // model: openrouter("openrouter/aurora-alpha"),
    model: openrouter("stepfun/step-3.5-flash:free"),
    prompt: obj.prompt,
    system: "Eres un ingeniero de software con 20 años de experiencia",
    temperature: 0
  })


  while (response.firstChild) {
    response.removeChild(response.firstChild)
  }

  for await (const text of result.textStream) {
    response.append(text)
  }

  submitBtn.disabled = false
}

const validarForm = async (e) => {
  e.preventDefault()

  if (Object.values(obj).some(valor => valor.trim() === "")) {
    alert("La consulta no puede ir vacía")
    return
  }

  submitBtn.disabled = true;

  const result = await generarRespuesta()
  // console.log(result)
}

// --- Eventos ---
form.addEventListener("submit", validarForm)
prompt.addEventListener("input", sincronizarData)