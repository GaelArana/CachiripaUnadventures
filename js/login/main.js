
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, updateProfile, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export class main extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        // Cargar recursos si es necesario
    }

    create() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }

        // Crear un iframe en el DOM para cargar el HTML externo
        const iframe = document.createElement('iframe');
        iframe.src = '../html/login.html'; // Ruta del archivo HTML externo
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.zIndex = '1';
        document.body.appendChild(iframe);

        // Esperar a que el iframe se cargue completamente
        iframe.onload = () => {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            if (!iframeDoc) {
                console.error("No se pudo obtener el documento del iframe.");
                return;
            }

            // Agregar CSS al iframe
            const link = iframeDoc.createElement('link');
            link.rel = 'stylesheet';
            link.href = "../css/login.css"; // Ruta del archivo CSS
            iframeDoc.head.appendChild(link);
            const style = iframeDoc.createElement('style');
            style.textContent = `
                .swal-overlay {
                    z-index: 99999;
                }
                .swal-modal {
                    z-index: 100000;
                    font-family: 'Roboto', sans-serif; /* Cambia 'Roboto' por la fuente deseada */
                }
                .swal-title, .swal-text {
                    font-family: 'Roboto', sans-serif; /* Cambia 'Roboto' por la fuente deseada */
                }
            `;
            iframeDoc.head.appendChild(style);

            // Añadir el código para manejar el focus y blur en los inputs dentro del iframe
            this.setupFocusBlur(iframeDoc);

            const script = iframeDoc.createElement('script');
            script.textContent = `
                function registrocuenta() {
                    const formLogin = document.querySelector(".contenedor");
                    const formCreate = document.querySelector(".contenedor-create");

                    formLogin.style.display = "none";
                    formCreate.style.display = "block";
                }

                function volverInicio() {
                    const formLogin = document.querySelector(".contenedor");
                    const formCreate = document.querySelector(".contenedor-create");
                    const formRecover = document.querySelector(".contenedor-recuperar");

                    formLogin.style.display = "block";
                    formCreate.style.display = "none";
                    formRecover.style.display = "none";
                }

                function recuperarcuenta() {
                    const formRecover = document.querySelector(".contenedor-recuperar");
                    const formLogin = document.querySelector(".contenedor");
                    const formCreate = document.querySelector(".contenedor-create");

                    formRecover.style.display = "block";
                    formLogin.style.display = "none";
                    formCreate.style.display = "none";
                }
            `;
            iframeDoc.body.appendChild(script);

            // Configuración de Firebase
			const firebaseConfig = {
                apiKey: "AIzaSyCqDFycAPeIItBo_DpDtMM9zTT5CMQNKnY",
                authDomain: "cachiripa-2fef2.firebaseapp.com",
                databaseURL: "https://cachiripa-2fef2-default-rtdb.firebaseio.com",
                projectId: "cachiripa-2fef2",
                storageBucket: "cachiripa-2fef2.appspot.com",
                messagingSenderId: "726061639887",
                appId: "1:726061639887:web:d00a167a14aef0ad586fba",
                measurementId: "G-QQCHXZC0NG"
            };

            // Inicializa Firebase
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);

            this.setupCreateAccountForm(iframeDoc, auth);
            this.setupLogin(iframeDoc, auth);
            this.setupGoogleSignIn(iframeDoc, auth);
            this.setupAnonymousSignIn(iframeDoc, auth);
            this.setupPasswordReset(iframeDoc, auth); // Recuperación de contraseña
            this.setupAuthObserver(auth);
        };
    }

    setupCreateAccountForm(iframeDoc, auth) {
        const formCreate = iframeDoc.getElementById("form_create");
        formCreate.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = iframeDoc.getElementById("usuario").value; // Obtener el nombre del input
            const email = iframeDoc.getElementById("email_up").value;
            const password = iframeDoc.getElementById("password_up").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Actualizar el perfil del usuario con el nombre
                    return updateProfile(user, {
                        displayName: name
                    });
                })
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Cuenta creada con éxito",
                        text: `Bienvenido, ${name}`,
                        showConfirmButton: false,
                    });
                    formCreate.reset();
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al crear cuenta",
                        text: error.message,
                        showConfirmButton: false
                    });
                });
        });
    }

    setupLogin(iframeDoc, auth) {
        const loginForm = iframeDoc.getElementById("form_login");
        if (!loginForm) {
            console.error("El formulario de login no se encontró en el iframe.");
            return;
        }

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = iframeDoc.getElementById("email").value;
            const password = iframeDoc.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    Swal.fire({
                        icon: "success",
                        title: `Bienvenido, ${user.displayName || "usuario"}`,
                        text: "Has iniciado sesión correctamente",
                        showConfirmButton: false,
                    });
                    loginForm.reset();
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al iniciar sesión",
                        text: "Su correo no está registrado o la contraseña es incorrecta",
                        showConfirmButton: false
                    });
                });
        });
    }

    setupGoogleSignIn(iframeDoc, auth) {
        const googleSignInButton = iframeDoc.getElementById("googlelogin");
        if (!googleSignInButton) {
            console.error("El botón de inicio de sesión con Google no se encontró en el iframe.");
            return;
        }

        googleSignInButton.addEventListener("click", () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    Swal.fire({
                        icon: "success",
                        title: `Bienvenido, ${user.displayName || "usuario"}`,
                        text: "Has iniciado sesión con Google correctamente",
                        showConfirmButton: false,
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al iniciar sesión con Google",
                        text: error.message,
                        showConfirmButton: false
                    });
                });
        });
    }

    setupAnonymousSignIn(iframeDoc, auth) {
        const anonymousSignInButton = iframeDoc.getElementById("invited");
        if (!anonymousSignInButton) {
            console.error("El botón de inicio de sesión anónimo no se encontró en el iframe.");
            return;
        }

        anonymousSignInButton.addEventListener("click", () => {
            signInAnonymously(auth)
                .then((userCredential) => {
                    const user = userCredential.user;

                    updateProfile(user, {
                        displayName: "Invitado"
                    }).then(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Inicio de sesión anónimo exitoso",
                            text: `Bienvenido, ${user.displayName || "Invitado"}`,
                            showConfirmButton: false,
                        });
                    }).catch((error) => {
                        console.error("Error al actualizar el perfil del usuario:", error);
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al iniciar sesión anónimamente",
                        text: error.message,
                        showConfirmButton: false
                    });
                });
        });
    }

    setupPasswordReset(iframeDoc, auth) {
        const resetPasswordForm = iframeDoc.getElementById("form_r");
        if (!resetPasswordForm) {
            console.error("El formulario de recuperación de contraseña no se encontró en el iframe.");
            return;
        }

        resetPasswordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = iframeDoc.getElementById("recuperar").value;

            try {
                await sendPasswordResetEmail(auth, email);
                Swal.fire({
                    icon: "success",
                    title: "Recuperación de contraseña",
                    text: "Se ha enviado un enlace de recuperación a su correo electrónico",
                    showConfirmButton: false,
                });
                resetPasswordForm.reset();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error al recuperar contraseña",
                    text: error.message,
                    showConfirmButton: false
                });
            }
        });
    }


    setupFocusBlur(iframeDoc) {
        const inputs = iframeDoc.querySelectorAll(".input");

        function addcl() {
            let parent = this.parentNode.parentNode;
            parent.classList.add("focus");
        }

        function remcl() {
            let parent = this.parentNode.parentNode;
            if (this.value === "") {
                parent.classList.remove("focus");
            }
        }

        inputs.forEach(input => {
            input.addEventListener("focus", addcl);
            input.addEventListener("blur", remcl);
        });
    }
     
    setupAuthObserver(auth) {
        // Observador de autenticación
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Ocultar el iframe
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    iframe.style.display = 'none';
                }
        
                // Mostrar el canvas
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.display = 'block';
                }
        
                // Cambiar a la escena deseada
                this.scene.start('StartScene');
            } else {
                console.log("Usuario no autenticado.");
            }
        });
    }
	
}



/*


const logout = document.getElementById("logout");

logout.addEventListener("click", (e) => {
	e.preventDefault();
    auth.signOut()
    .then(() => {
        Swal.fire({
			icon: "success",
            title: "Sesión cerrada correctamente",
            showConfirmButton: true,
            
		})
		login.reset()
    })
	.catch ((error) => {
        console.error(error);
    });
});


auth.onAuthStateChanged((user) => {
	if (user) {
        console.log(user);
        logout.style.display="block"
        invited.style.display="none"
        googlelogin.style.display="none"
        inicios.style.display="none"
		email.style.display="none"
		password.style.display="none"
		crearcuenta.style.display="none"
		contraseñas.style.display="none"
    } else {
        console.log("No user is signed in.");
        logout.style.display="none"
        invited.style.display="block"
        googlelogin.style.display="block"
        inicios.style.display="block"
		email.style.display="block"
		password.style.display="block"
		crearcuenta.style.display="block"
		contraseñas.style.display="block"

    }
})

const recuperar = document.getElementById("form_r");

recuperar.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = document.getElementById("recuperar").value;

	try {
		// Intentar enviar el correo de recuperación
		await auth.sendPasswordResetEmail(email);
		Swal.fire({
			icon: "success",
			title: "Se ha enviado un correo para recuperar la contraseña",
			text: "Por favor, revisa tu bandeja de entrada.",
			showConfirmButton: true
		});
		recuperar.reset();
	} catch (error) {
		console.error(error);
		Swal.fire({
			icon: "error",
			title: "Error al enviar el correo de recuperación",
			text: error.message,
			showConfirmButton: true
		});
	}
});
const invited = document.getElementById("invited")

invited.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signInAnonymously()
		.then(() => {
			const user = auth.currentUser;
			// Establecer un nombre predeterminado para el usuario anónimo
			user.updateProfile({
				displayName: "Usuario Invitado"
			}).then(() => {
				Swal.fire({
					icon: "success",
					title: "Bienvenido, Usuario Invitado",
					showConfirmButton: false,
					timer: 1500
				});
				logout.style.display = "block";
			}).catch((error) => {
				Swal.fire({
					icon: "error",
					title: "Error al establecer nombre",
					text: error.message,
					showConfirmButton: false
				});
			});
		})
		.catch((error) => {
			Swal.fire({
				icon: "error",
				title: "Error al iniciar sesión anónima",
				text: error.message,
				showConfirmButton: false
			});
		});
});

*/