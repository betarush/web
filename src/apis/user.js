const routeUrl = `/flask/user`

export const register = data => {
	return fetch(`${routeUrl}/register`, {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
