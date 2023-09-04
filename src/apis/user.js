const routeUrl = `/flask/user`

export const register = data => {
	return fetch(`${routeUrl}/register`, {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const login = data => {
	return fetch(`${routeUrl}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getUserInfo = data => {
	return fetch(`${routeUrl}/get_user_info`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
