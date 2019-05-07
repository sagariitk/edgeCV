import React from 'react';
import { NavLink } from 'react-router-dom';
import Webcam from 'react-webcam';

async function api_call(url, body) {

    console.log("api called");
    try{
        const api_call = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.jwtToken
            }
            });
            const status = await api_call.status;
            console.log(status);
            if(status === 200) {
                console.log('pic captured');
            }
            else if(status === 403 || status === 422 || status === 401) {
                console.log('not authenticated please login');
                alert('not authenticated please login');
                window.location = '/Login';    
            }
            else {
                console.log('could not addd the pic to database');
                alert('could not addd the pic to database');
            }
    }
    catch(err){
        console.log(err);
        alert(err);
        window.location = '/Frames';    
    }

}
class Frames extends React.Component {
	logout = async (e) => {
		e.preventDefault();
		localStorage.removeItem("jwtToken");
		alert('you have been logged out');
		window.location = '/';
	}
	setRef = webcam => {
		this.webcam = webcam;
    };

    start = async (e) => {
        e.preventDefault();
        let total_duration = e.target.elements.total_duration.value;
        let split_time = e.target.elements.split_time.value;
        let color_tone = e.target.elements.color.value;
        if(!e.target.elements.total_duration.value){
            alert('total_duration can not be blank');
            window.location = '/Frames';
        }
        else if(!e.target.elements.split_time.value){
            alert('split_time can not be blank');
            window.location = '/Frames';
        }
        else{
            this.capture(total_duration, split_time, color_tone);  
        }
    }

	capture = (total_duration, split_time, color_tone) => {
        var today = new Date();
        // let count = parseInt(total_duration)/parseInt(split_time);
        // let delay = parseInt(split_time)*1000

        let imageSrc = this.webcam.getScreenshot();
        let url = 'http://localhost:5000/capture';
        var timeStamp= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() +'-'+ today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + ".png";
        let pic_name = color_tone + "_" + timeStamp
        const body = {
            image_name: pic_name,
            image_URI: imageSrc,
            color_tone: color_tone
        }
        api_call(url, body); 

    }
	render() {
		const videoConstraints = {
			width: 1280,
			height: 720,
			facingMode: "user"
		};

		return (
			<div className="container">
				<div className="header-logo">
				</div>
				<div className="header">
					<div className="navbar">
						<NavLink to="/"><strong style={{ fontSize: 20, padding: 5 }}>Home</strong></NavLink>
						<NavLink to="/Frames"><strong style={{ fontSize: 20, padding: 5 }}>Capture Frames</strong></NavLink>
						<NavLink to="/Login"><strong style={{ fontSize: 20, padding: 5 }}>Login</strong></NavLink>
						<NavLink to="/" onClick={this.logout} ><strong style={{ fontSize: 20, padding: 5 }}>Logout</strong></NavLink>
					</div>
				</div>
				<div className="main-landing">
					<Webcam
						audio={false}
						height={400}
						ref={this.setRef}
						screenshotFormat="image/png"
						width={560}
						videoConstraints={videoConstraints}
					/>
                    <form onSubmit={this.start} style={{ fontSize: 20, padding:5 }}>
                        <input type="text" name="total_duration" placeholder="Total Duration"></input><br></br>
                        <input type="text" name="split_time" placeholder="Split Time"></input><br></br>
                        <select name="color">
                            <option value="Color">Colored</option>
                            <option value="gray">GreyScale</option>
                        </select><br></br>
                        <button >Start Capturing</button>
                    </form>
				</div>
				<div className="footer">
				</div>
			</div>
		);
	}
}
export default Frames;
