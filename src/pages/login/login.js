/**
 * login.js
 * 
 * Inicializa la lógica del formulario de login.
 * Intercepta el submit, valida campos y simula login.
 * Si el checkbox #remember está tildado, guarda en localStorage que el login fue exitoso.
 */
export function initLogin() {
    console.log('JFT - 🔐 initLogin cargado');

    const $form = $('#loginForm');
    const $username = $('#username');
    const $password = $('#password');
    const $remember = $('#remember');

    const $togglePassword = $('#toggle-pasword')

    /**
     * Evento de envío del formulario
     */
    $form.on('submit', async function (e) {
        e.preventDefault();

        const user = $username.val()?.toString().trim();
        const pass = $password.val()?.toString().trim();
        const remember = $remember.is(':checked');

        if (!user || !pass) {
            showStatus('Por favor, completá usuario y contraseña.', 'error');
            return;
        }

        showStatus('Validando credenciales...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (user === 'admin' && pass === '1234') {
            showStatus('Inicio de sesión exitoso. Redirigiendo...', 'success');

            if (remember) {
                localStorage.setItem('rememberLogin', 'true');
            }

            setTimeout(() => {
                document.location = '/index.html';
            }, 1000);
        } else {
            showStatus('Usuario o contraseña incorrectos.', 'error');
        }
    });

    $togglePassword.on('click', function() {
        console.log('click')
        const tipoActual = $password.attr('type');
        $password.attr('type', tipoActual === 'password' ? 'text' : 'password');
    })

    tryAutoLogin();
}

/**
     * Si hay un login recordado en localStorage, redirige automáticamente.
     */
async function tryAutoLogin() {
    const remembered = localStorage.getItem('rememberLogin');
    if (remembered === 'true') {
        showStatus('🔄 Login recordado detectado. Redirigiendo...', )

        await new Promise(resolve => setTimeout(resolve, 1500));
        document.location = 'index.html';
    }
}

/**
 * Muestra un mensaje en el contenedor #loginStatus
 * @param {string} message 
 * @param {'info'|'success'|'error'} type 
 */
function showStatus(message, type = 'info') {

    const $status = $('#loginStatus');

    const colors = {
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600'
    };
    $status
        .removeClass()
        .addClass(`mt-2 text-sm ${colors[type]}`)
        .text(message);
}
