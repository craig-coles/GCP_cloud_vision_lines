# GCP cloud vision lines
A simple JS function for getting back lines of text with coords and dimensions from Google Cloud vision API.

**Please note:** This package is not affiliated with Google in any way. I saw a need for a service that provided
parsing of the data returned from Google's Cloud Vision API so I filled it.

For more on the Google Cloud Vision API, please go here https://cloud.google.com/vision/docs/reference/rest/




## How to Use
```
 
const vision = require('@google-cloud/vision');

const { cloudVisionLines } = require('gcp_cloud_vision_lines');

// This is the boiler plate for authing if you haven't
//used the gcloud CLI to authenticate to your service account

const client = new vision.ImageAnnotatorClient({
  projectId: <YOUR PROJECT ID HERE>,
  keyFilename: path.resolve(`YOUR/GCP_KEY_FILE_PATH}`)
});

const filePath = 'PATH/TO/THE/FILE/I/WANT/TO/ANALYZE';

const [result] = await client.documentTextDetection(filePath);

cloudVisionLines(result.fullTextAnnotation); // This is the function exported from the module :)


```

You should get a response that looks like the following

```
[ 
  { text: 'Wahaca ', // the text it found
    coords:
     { tl: {"x":516,"y":107}, // the top left coord of the line
       tr: {"x":636,"y":107}, // the top right coord of the line
       br: {"x":636,"y":155}, // the bottom right coord of the line
       bl: {"x":516,"y":155}, // the bottom left coord of the line
       w: 120, // the width dimension of the line
       h: 48 // the height dimension of the line
     } 
  },
  { text: '19 - 23 Charlotte Street ',
    coords:
     { tl: {"x":330,"y":156},
       tr: {"x":813,"y":156},
       br: {"x":813,"y":207},
       bl: {"x":330,"y":207},
       w: 483,
       h: 51 
     }
  }
];
```
