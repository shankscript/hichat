(function () {
	var getNode = function (s) {
		return document.querySelector(s);
	},
	textArea = getNode('.chat textarea'),
	chatName = getNode('.chat-name'),
	messages = getNode('.chat-messages'),
	status = getNode('.chat-status span'),
	statusDefault = status.textContent,

	setStatus = function (s) {
		status.textContent = s;

		if (s !== statusDefault) {
			var delay = setTimeout(function () {
					setStatus(statusDefault);
					clearInterval(delay);
				}, 3000);
		}
	};
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ':80');
	}
	//setStatus('testing');
	try {
		var socket = io.connect(location.origin);
	} catch (e) {
		//alert(e);
		//console.log(e);
	}

	if (socket !== undefined) {
		//console.log("Allz well");

		socket.on('output', function (d) {
			//console.log(d);
			var l = d.length;

			if (l) {
				for (var i = 0; i < l; i++) {
					var m = document.createElement('div');
					if (!m.classList) {
						m.className = 'chat-message';
					} else {
						m.classList.add('chat-message');
					}
					m.textContent = d[i].name + ": " + d[i].message;
					//alert(messages.firstChild || null);
					//messages.appendChild(m);
					messages.insertBefore(m, messages.firstChild || null);
				}

			}
		});

		socket.on('status', function (d) {
			setStatus((typeof d === 'object') ? d.message : d);

			if (d.clear === true) {
				textArea.value = '';
			}
		});
		textArea.addEventListener = textArea.addEventListener || textArea.attachEvent;
		textArea.addEventListener('keydown', function (e) {
			var self = this,
			name = chatName.value;

			if (e.keyCode === 13 && e.shiftKey === false) {
				//console.log("send");
				e.preventDefault();
				socket.emit('input', {
					name : name,
					message : self.value
				});
			}
		});

	}

})();
