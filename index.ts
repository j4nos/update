export interface UpdateObjParams {
	object: any
	keyPath: (string | number)[]
	value?: any
	operation?: 'setValue' | 'changeAt' | 'push' | 'pop' | 'removeKey' | 'replace'
}
export const updateObj = ({
	object,
	keyPath,
	value,
	operation,
}: UpdateObjParams) => {
	let valueAtKeyPath = keyPath?.reduce((acc, key) => acc?.[key], object)
	let lastKey = keyPath?.[keyPath?.length - 1]
	let keyPathOfParent = keyPath?.slice(0, keyPath?.length - 1)
	let valueOfParent = keyPathOfParent?.reduce((acc, key) => acc?.[key], object)

	switch (operation) {
		case 'setValue':
		case 'changeAt': {
			if (Array.isArray(valueOfParent)) {
				let newValueOfParent = [...valueOfParent]
				newValueOfParent?.splice(lastKey as number, 1, value)
				return replaceValueAtKeyPath(keyPathOfParent, newValueOfParent, object)
			} else {
				return replaceValueAtKeyPath(keyPath, value, object)
			}
		}
		case 'push': {
			let newValue = [...valueAtKeyPath]
			newValue?.push(value)
			return replaceValueAtKeyPath(keyPath, newValue, object)
		}
		case 'pop': {
			let newValue = [...valueAtKeyPath]
			newValue?.pop()
			return replaceValueAtKeyPath(keyPath, newValue, object)
		}
		case 'removeKey': {
			if (Array.isArray(valueOfParent)) {
				let newValueOfParent = [...valueOfParent]
				newValueOfParent?.splice(lastKey as number, 1)
				return replaceValueAtKeyPath(keyPathOfParent, newValueOfParent, object)
			} else {
				let newValueOfParent = { ...valueOfParent }
				delete newValueOfParent?.[lastKey as string]
				return replaceValueAtKeyPath(keyPathOfParent, newValueOfParent, object)
			}
		}
		case 'replace': {
			let newValueOfParent = { ...valueOfParent }
			newValueOfParent[value as string] = valueAtKeyPath
			delete newValueOfParent?.[lastKey as string]
			return replaceValueAtKeyPath(keyPathOfParent, newValueOfParent, object)
		}
	}
}

const replaceValueAtKeyPath = (
	[first, ...rest]: any,
	value: any,
	collection?: any,
	isDateConversionRequired?: Boolean
): any => {
	if (typeof first === 'number') {
		let newArray = collection ? [...collection] : []
		newArray?.splice(
			first,
			1,
			rest?.length
				? replaceValueAtKeyPath(rest, value, collection?.[first])
				: value
		)
		return newArray
	} else {
		return {
			...collection,
			[first]: rest?.length
				? replaceValueAtKeyPath(rest, value, collection?.[first])
				: value,
		}
	}
}
