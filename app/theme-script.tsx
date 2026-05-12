// Este script se ejecuta antes de que React hidrate la página
// Lee el tema guardado y aplica la clase 'dark' inmediatamente
(function() {
  try {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch (e) {
    // Si localStorage no está disponible, no hacemos nada
  }
})()
