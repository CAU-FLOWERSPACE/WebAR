class ARButton {

	// ABButton 의 class method
	static createButton( renderer, sessionInit = {} ) {

		const button = document.createElement( 'button' );

		/* START showStartAR */
		function showStartAR( /*device*/ ) {

			let currentSession = null;

			// START AR 버튼이 눌리면 불리는 함수!!!
			function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				renderer.xr.setReferenceSpaceType( 'local' );
				renderer.xr.setSession( session );  // 얘가 있어야 폰에서 카메라가 켜지나
				button.textContent = 'STOP AR';
				// sessionInit.domOverlay.root.style.display = '';
				// console.log("STOP AR");

				currentSession = session;

			}

			// STOP AR 버튼이 눌리면 불리는 함수!!!
			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'START AR';
				// sessionInit.domOverlay.root.style.display = 'none';

				currentSession = null;

			}

			// button 속성

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';
			button.textContent = 'START AR';

			button.onmouseenter = function () {

				button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				button.style.opacity = '0.5';

			};

			// button 이 클릴될 때!!
			button.onclick = function () {

				// 현재 session 이 없으면 requestSession 을 보낸 후 AR을 시작하고, 있으면 AR 을 종료시킨다.
				if ( currentSession === null ) {

					navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );
				} else {

					currentSession.end();

					// STOP AR 
					const message = document.createElement( 'a' );

					if ( window.isSecureContext === false ) {

						message.href = document.location.href.replace( /^http:/, 'https:' );

					} else {
						document.location.href = 'https://dc4a-211-58-89-158.ngrok.io/';  // 꽃 추천 리스트 페이지로 돌아가기
					}

					message.style.left = 'calc(50% - 90px)';
					message.style.width = '180px';
					message.style.textDecoration = 'none';

					stylizeElement( message );

					return message;

				}

			};

		}

		// AR 기능을 지원하지 않을 때, change disablebutton
		function disableButton() {

			button.style.display = '';

			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.onmouseenter = null;
			button.onmouseleave = null;
			button.onclick = null;
		}

		function showARNotSupported() {

			disableButton();
			button.textContent = 'AR NOT SUPPORTED';
		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';
		}

		if ( 'xr' in navigator ) {

			button.id = 'ARButton';
			button.style.display = 'none';

			stylizeElement( button );

			// isSessionSupported(): resolves to true if the specified WebXR session mode is supported by the user's WebXR device.
			navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

				supported ? showStartAR() : showARNotSupported();
			} ).catch( showARNotSupported );

			return button;

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://localhost:3000';  // 꽃 추천 리스트 페이지로 돌아가기
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	}

}

export { ARButton };
