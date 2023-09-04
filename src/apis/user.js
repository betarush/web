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

export const getPaymentInfo = data => {
	return fetch(`${routeUrl}/get_payment_info`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getBankaccountInfo = data => {
	return fetch(`${routeUrl}/get_bankaccount_info`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const submitPaymentInfo = data => {
	return fetch(`${routeUrl}/submit_payment_info`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const submitBankaccountInfo = data => {
	return fetch(`${routeUrl}/submit_bankaccount_info`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
