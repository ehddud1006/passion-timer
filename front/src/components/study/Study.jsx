import React from 'react';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

function Study() {
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "./my_model/";

    let model, webcam, labelContainer, maxPredictions;
    let total_studied = 0, prev_time, offset_time = 0;
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        prev_time = new Date();
        offset_time = new Date();

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);

        var cur_t = new Date();
        var diff_t = cur_t.getTime() - prev_time.getTime();
        prev_time = cur_t;

        if (prediction[0].className == "studying" && 0.9 < prediction[0].probability.toFixed(2)) {
            total_studied = total_studied + diff_t;
            console.log(total_studied);

            var format_t = new Date(total_studied - 32400000);

            labelContainer.childNodes[0].innerHTML = "공부 잘 하고 있네  H:" + cur_t.getHours() + "M: " + cur_t.getMinutes() + "S:" + cur_t.getSeconds();
            // labelContainer.childNodes[1].innerHTML = "누적 공부시간 : " + total_studied.toString();
            labelContainer.childNodes[1].innerHTML = "누적 공부시간 : " + format_t.getHours() + "시간  " + format_t.getMinutes() + "분  " + format_t.getSeconds() + "초";
        } else if (prediction[1].className == "playing" && 0.9 < prediction[0].probability.toFixed(2)) {
            labelContainer.childNodes[0].innerHTML = "공부 안하네? 용돈 깎는다 ^^ H: " + cur_t.getHours() + "M: " + cur_t.getMinutes() + "S:" + cur_t.getSeconds();
        } else {
            labelContainer.childNodes[0].innerHTML = "뭐하는지 모르겠네 우리 아들? ^^ CCTV 돌려본다?? ㅎㅎ H: " + cur_t.getHours() + "M: " + cur_t.getMinutes() + "S:" + cur_t.getSeconds();
        }
    }
    return (
        <div>
            <div>Teachable Machine Image Model</div>
            <button type="button" onclick={init}>Start</button>
            <div id="webcam-container"></div>
            <div id="label-container"></div>
            <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
            <script src="https://code.jquery.com/jquery-3.5.1.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
        </div>
    );
}

export default Study;