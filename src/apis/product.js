const url = process.env.REACT_APP_MODE == 'live' ? 'https://www.getproductfeedback.com' : ''
const routeUrl = `${url}/flask/product`

export const listProduct = data => {
	return fetch(`${routeUrl}/list_product`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const relistProduct = data => {
	return fetch(`${routeUrl}/relist_product`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getUntestedProducts = data => {
	return fetch(`${routeUrl}/get_untested_products`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getTestedProducts = data => {
	return fetch(`${routeUrl}/get_tested_products`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getMyProducts = data => {
	return fetch(`${routeUrl}/get_my_products`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const tryProduct = data => {
	return fetch(`${routeUrl}/try_product`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getFeedbacks = data => {
	return fetch(`${routeUrl}/get_feedbacks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
