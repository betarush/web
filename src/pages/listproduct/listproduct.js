import './listproduct.scss';
import { useEffect, useState } from 'react';
import { getId, resizePhoto } from 'geottuse-tools';
import { listProduct } from '../../apis/product'

// components
import Header from '../components/header'

export default function Listproduct() {
	const [name, setName] = useState('chatee')
	const [desc, setDesc] = useState('match with friends, explore their posts and like their posts to talk with them')
	const [link, setLink] = useState('https://www.chatee.app')
	const [image, setImage] = useState({ uri: '', width: 0, height: 0 })
	const [file, setFile] = useState(null)
	const [errorMsg, setErrormsg] = useState('')

	const listTheProduct = () => {
		if (name && desc && link) {
			const data = { name, desc, link, image: JSON.stringify(image) }

			listProduct(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						window.location = "/main"
					}
				})
				.catch((err) => {
					if (err.status == 400) {
						err.json().then(() => {
							
						})
					}
				})
		} else {
			if (!name) {
				setErrormsg("Please enter your product name")
			} else if (!desc) {
				setErrormsg("Please enter your product information")
			} else {
				setErrormsg("Please enter your product website")
			}
		}
	}
	const chooseImage = e => {
		if (e.target.files && e.target.files[0]) {
			let reader = new FileReader()

			reader.onload = e => {
				let imageReader = new Image()

				imageReader.onload = () => {
					setImage({
						uri: e.target.result,
						width: imageReader.width,
						height: imageReader.height
					})
				}

				imageReader.src = e.target.result
			}

			reader.readAsDataURL(e.target.files[0])
		}
	}

	return (
		<div id="listproduct">
			<Header/>

			<div id="form">
				<div id="header">What is your startup</div>

				<div className="form-input">
					<div className="input-header">Enter product name:</div>
					<input class="input" placeholder="What is your product name" type="text" onChange={e => setName(e.target.value)} value={name}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter product information:</div>
					<textarea 
						class="input" 
						placeholder="etc: what is the product about, what problem does it solve and how does it solve it" 
						type="text" onChange={e => setDesc(e.target.value)} value={desc}
						style={{ height: 300 }}
					/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter product link to lead customers:</div>
					<input class="input" placeholder="What is your product website" type="text" onChange={e => setLink(e.target.value)} value={link}/>
				</div>
				<div className="form-input">
					<div className="input-header">Provide product logo: (Optional)</div>

					<div id="browse-image" onClick={() => file.click()}>Browse Logo</div>

					{image.uri && (
						<div style={{ margin: '0 auto', ...resizePhoto(image, 300, 300) }}>
							<img src={image.uri} style={{ height: '100%', width: '100%' }}/>
						</div>
					)}

					<input 
						type="file" ref={r => setFile(r)} 
						onChange={chooseImage} style={{ display: 'none' }}
						stye={{ display: 'none' }}
					/>
				</div>

				<div id="errormsg">{errorMsg}</div>

				<div id="submit" onClick={() => listTheProduct()}>Register</div>
			</div>
		</div>
	)
}