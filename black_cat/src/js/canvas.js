const doc = document
// Get canvas ID
const getCanvas = a => doc.getElementById(a);
const getContext = a => a.getContext('2d');

// Image
const createImg = _ =>new Image()
const toPng = a =>a.toDataURL()

const canvas = getCanvas('a')
const ctx = getContext(canvas);

export { canvas, ctx }