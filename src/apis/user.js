const url = process.env.REACT_APP_MODE == 'live' ? 'https://www.getproductfeedback.com' : ''
const routeUrl = `${url}/flask/user`

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

export const verify = data => {
	return fetch(`${routeUrl}/verify`, {
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

export const updateFirstTime = data => {
	return fetch(`${routeUrl}/update_first_time`, {
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

export const rewardCustomer = data => {
	return fetch(`${routeUrl}/reward_customer`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const rejectFeedback = data => {
	return fetch(`${routeUrl}/reject_feedback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getEarnings = data => {
	return fetch(`${routeUrl}/get_earnings`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const createCheckout = data => {
	return fetch(`${routeUrl}/create_checkout`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const createCustomerPayment = data => {
	return fetch(`${routeUrl}/create_customer_payment`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
