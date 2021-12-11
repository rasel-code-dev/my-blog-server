
import {readdir, stat} from "fs/promises"

import path from "path";

const AdmZip = require("adm-zip");

function createZip() {
	
	let dirs = ["database", "markdown"]
	
	return new Promise(async (resolve, reject)=>{
		
		// creating archives
		const zip = new AdmZip();

		// add file directly
		// const content = "inner content of the file";
		// zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");
		// // add local file
		
		// zip.addLocalFile("/home/me/some_picture.png");
		
		let count;
		dirs.forEach(( d)=>{
			(async function (){
				let s = await stat(path.resolve(`src/${d}`))
				if(s && s.isDirectory()) {
					let files = await readdir(path.resolve(`src/${d}`))
					files.forEach(f => {
						(async function (){
							let fileStats = await stat(`./src/${d}/${f}`)
							if(fileStats.isFile()) {
								zip.addLocalFile(`./src/${d}/${f}`);
							}
						}())
					})
				}
			}())
			
			setTimeout(()=>{
				zip.writeZip(`./src/backup/files.zip`);
				const willSendthis = zip.toBuffer();
				resolve(willSendthis)
			}, 5000)
			
			
			// fs.readdir(`./src/${d}`, (err, file)=>{
			//
			// })

		})
		
		// get everything as a buffer
		
		
		// const willSendthis = zip.toBuffer();
		
		// or write everything to disk
		// console.log(willSendthis)
	})
}

export default createZip