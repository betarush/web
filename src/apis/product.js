const url = process.env.REACT_APP_MODE == 'live' ? process.env.REACT_APP_API_URL : ''
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

export const getTestingProducts = data => {
	return fetch(`${routeUrl}/get_testing_products`, {
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

export const getProductFeedbacks = data => {
	return fetch(`${routeUrl}/get_product_feedbacks`, {
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
