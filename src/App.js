import React, { useState, Fragment } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const App = () => {

  const [blob, setBlob] = useState('');
  const [documentId, setdocumentId] = useState('');

  const onSubmit = async e => {
    const formData = {
      title: 'title',
      description: 'description',
      blob: blob
    };

    e.preventDefault();
    // console.log('*********************formData**********************');
    // console.log(formData);
    // console.log('*********************formData**********************');
    createPost({ formData });
    setBlob('');
  };

  // Create a post
  const createPost = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const body = JSON.stringify(formData);
      // console.log('***********formData**************');
      // console.log(formData);
      // console.log('***********formData**************');
      const res = await axios.post('/post', body, config);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPost = async (dId) => {
    try {
      if (dId && dId.length > 0) {
        const res = await axios.get(`/post/${dId}`);
        setBlob(res.data.blob);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleEditorChange = (content, editor) => {
    setBlob(content);
  }

  return (
    <Fragment>
      <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1" onSubmit={e => onSubmit(e)}>


          <Editor
            apiKey="aqzfuanieohcgrxpvrnllu8rauveikq88fz9oh53426k5d0c"
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount imagetools'
              ],
              toolbar:
                'undo redo | image | fontselect | fontsizeselect | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help',
              automatic_uploads: true,
              file_picker_types: 'image',
              /* and here's our custom image picker*/
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                /*
                  Note: In modern browsers input[type="file"] is functional without
                  even adding it to the DOM, but that might not be the case in some older
                  or quirky browsers like IE, so you might want to add it to the DOM
                  just in case, and visually hide it. And do not forget do remove it
                  once you do not need it anymore.
                */

                input.onchange = function () {
                  var file = this.files[0];

                  var reader = new FileReader();
                  reader.onload = function () {
                    /*
                      Note: Now we need to register the blob in TinyMCEs image blob
                      registry. In the next release this part hopefully won't be
                      necessary, as we are looking to handle it internally.
                    */
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: file.name });
                  };
                  reader.readAsDataURL(file);
                };

                input.click();
              }
            }}
            value={blob}
            onEditorChange={handleEditorChange}
          />
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
          <div className="my-2">
            <button onClick={() => loadPost(documentId)} type="button" className="btn btn-light">
              Load Post
            </button>
            <input type="text" placeholder="Document Id" name="documentid" onChange={e => setdocumentId(e.target.value)} />
          </div>
          {/* <p className="lead">
            Response: {response ? response : 'Nothing at all!'}
          </p> */}

        </form>
      </div>
    </Fragment >
  )

}

export default App;
