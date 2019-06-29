import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'


export default function Form() {


	/*constructor(props) {
	    super(props);
	    this.state = { 
	    	file: [],
	    	files: [],
	    };

	    this.handleChange = this.handleChange.bind(this);
	    this.UploadSingleFile = this.UploadSingleFile.bind(this);
	}*/



	const [file, setFile] = useState([]);
	const [singleUpload,setSingleUpload] = useState([]);

	const [filess, setFiles] = useState([]);
	const [multiUpload,setMultiUpload] = useState([]);

	//console.log(file);
	//console.log(formData);

	const UploadSingleFile = useCallback((event) => {
		// var function scoped 
		// let block scoped
		event.preventDefault();
		var formData = new FormData();

		if (file.length !== 0) {
			formData.append("file",file);
			//console.log(file)
			


			/*const request = async () => { 
				const result = await axios({
					method: 'POST',
					url: 'http://localhost:8080/uploadFile',
					data: formData,
					headers: {'Content-Type': 'multipart/form-data'}
				});

				console.log(result);

			};*/

		}
		for (var key of formData.entries()) {
        	console.log(key[0] + ', ' + key[1]);
    	}

		axios({
			method: 'post',
			url: 'http://localhost:8080/uploadFile',
			data: formData,
			headers: {'content-type': 'multipart/form-data'},
			})
			.then(function(response) {

				console.log(response)

				
				setSingleUpload(
	        		<div id="singleFileUploadSuccess" style={{display: "block"}}>
	        			<p>File Uploaded Successfully.</p>
	        			<p>DownloadUrl : <a href={response.data.fileDownloadUri} target='_blank'>{response.data.fileDownloadUri}</a></p>
	        		</div>
        		)
			})
			.catch(function(response) {

				console.log(response)

				setSingleUpload(
	        		<div id="singleFileUploadError">
	        			 {response.data}
	        		</div>
        		)
			})
				
			 


			//}

		// other way with XMLHttpRequest


		/*var xhr = new XMLHttpRequest();
		//xhr.setRequestHeader('content-type','multipart/form-data');
		xhr.open('POST', 'http://localhost:8080/uploadFile');
		


		xhr.onload = function() {
			console.log(xhr.status)
	        console.log(xhr.responseText);
	        var response = JSON.parse(xhr.responseText);

	        if(xhr.status == 200) {
	        	setSingleUpload(
	        		<div id="singleFileUploadSuccess" style={{display: "block"}}>
	        			<p>File Uploaded Successfully.</p>
	        			<p>DownloadUrl : <a href={response.fileDownloadUri} target='_blank'>{response.fileDownloadUri}</a></p>
	        		</div>
        		)

	        } else {
        		setSingleUpload(
	        		<div id="singleFileUploadError">
	        			{(response && response.message) || "Some Error Occurred"}
	        		</div>
        		)
	        }
	    }
    	xhr.send(formData);	 */
    	

	},[file]);
	// currently called several times for the samel file!

 	
 	// IMPORTANT : same as the solutions in AJAX andJQuery that can be found, using event.target.value will ONLY GET THE FILE NAME.
 	// to access the file use event.target.files

	const handleChange = useCallback((event) => {
		const {name, files} = event.target;
		if (name === "file") {
			setFile(files[0]);
			console.log(files);
		}
	},[file]);

	// type="submit" in the form button will ask for a script as soon as you click on it, you cannot trigger your own callback
	// with it, so we dont specify a type and use onSubmit, which will listen to the file change



	const handleChanges = useCallback((event) => {
		const {name, files} = event.target;
		if (name === "files") {
			setFiles(files);
			console.log(files);
		}
	},[filess]);



	const UploadMultipleFiles = useCallback((event) => {
		// var function scoped 
		// let block scoped
		event.preventDefault();
		var formData = new FormData();

		if (filess.length !== 0) {
			for(let i = 0; i < filess.length; i++) {
		        formData.append("files", filess[i]);
		        //console.log(i);
		    }

		}
		//console.log(formData.getAll("files"));
		/*for (let i = 0; i < filess.length; i++) {
        	console.log(formData.getAll("files"));
    	}*/
	
		axios({
			method: 'post',
			url: 'http://localhost:8080/uploadMultipleFiles',
			data: formData,
			headers: {'content-type': 'multipart/form-data'},
			})
			.then(function(response) {

				console.log(response)

				const rows = response.data.map((file,index) =>
	        			<p>DownloadUrl : <a key={index} href={file.fileDownloadUri} target='_blank'>{file.fileDownloadUri}</a></p>
    				)

				setMultiUpload(
	        		<div id="multipleFileUploadSuccess" style={{display: "block"}}>
	        			<p>File Uploaded Successfully.</p>
	        			{rows}
	        		</div>
        		)
			})
			.catch(function(response) {

				//console.log(response)

				setMultiUpload(
	        		<div id="multipleFileUploadError">
	        			{(response && response.message) || "Some Error Occurred"}
	        		</div>
        		)
			})
				
			
    	

	},[filess]);



	return (

		<div className="form-container">

			<div className="upload-header">
                <h2>Spring Boot File Upload / Download Rest API Example</h2>
            </div>

        	<div className="upload-content">

        		<div className="single-upload">
					<form className="singleUploadForm" name="singleUploadForm" onSubmit={UploadSingleFile}>
						<input 
							id="singleFileUploadInput" 
							type="file" 
							name="file" 
							className="file-input" 
							onChange={handleChange}
							required/>
		                <button className="primary submit-btn">Submit</button>
		            </form>
  
		            <div className="upload-response">
		            	{singleUpload}
		            </div>
            	</div>

        		<div className="multiple-upload">
                    <h3>Upload Multiple Files</h3>
                    <form id="multipleUploadForm" name="multipleUploadForm" onSubmit={UploadMultipleFiles}>
                        <input 
                        	id="multipleFileUploadInput" 
                        	type="file" 
                        	name="files" 
                        	className="file-input" 
                        	onChange={handleChanges}
                        	multiple required />
                        <button className="primary submit-btn">Submit</button>
                    </form>
                    <div className="upload-response">
                        {multiUpload}
                    </div>
                </div>

        	</div>

		</div>

	);
	
}