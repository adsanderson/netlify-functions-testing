export async function handler(event, context) {
    const { payload } = JSON.parse(event.body);

    const response = payload
        .filter(toCountGreaterThan1)
        .map(toPersonCountAndThumbnail)

    return {
        statusCode: 200,
        body: JSON.stringify({ "response": response })
    };
}

const toCountGreaterThan1 = req => req.count > 1;

const getDetails = req => ({
    name: req.name,
    count: req.count
})

const toPersonCountAndThumbnail = req => {
    const thumbnail = req.logos.reduce(toSquareThumbnail, null);

    return {...getDetails(req), thumbnail}
}

const toSquareThumbnail = (selected, possible) => {
    const [size] = possible.size.split('x');
    if (+size > 128) return selected
    if (+size < 64) return selected
    if (!selected) return possible.url;

    const [selectedSize] = selected.split('x');

    if (selectedSize > size) return selected
    return possible.url
}