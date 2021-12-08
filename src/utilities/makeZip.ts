const zl = require("zip-lib");

function createZip(src, destFile) {
	return new Promise((resolve, reject)=>{
	zl.archiveFolder(src, destFile).then(function () {
		console.log("done to create zip.");
		resolve(true)
	}, function (err) {
		reject(err)
	});
	
	})
}

export default createZip