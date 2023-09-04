const routeUrl = '/flask/product'

export const listProduct = data => {
	return fetch(`${routeUrl}/list_product`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}