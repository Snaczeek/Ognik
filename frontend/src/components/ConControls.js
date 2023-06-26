import {React, useEffect, useContext, useState} from 'react'
import {  useParams } from "react-router-dom";
import CallIcon from "../assets/phone-call.png"
import CameraIcon from "../assets/camera.png"
import MicIcon from "../assets/mic.png"
import PhoneIcon from "../assets/phone.png"
import EndCall from "../assets/end-call.png"
import AuthContext from '../context/AuthContext'

let localStream;
let remoteStream;
let peerConnection
let isVisible = false
let is_in_call = false;
let friend_call = "none"
let isCalling = false

const ConControls = ({data = null, fcall}) => {
    // Getting username from URL
    let { username } = useParams();
    let string = username.toString();

    // const [isVisible, setIsVisible] = useState(false);

    // Getting access to authToken and WebSocket info from AuthContext
    let { WebSocket, authToken, user} = useContext(AuthContext)

    // !!! prop for sending ice can using webSockets !!!
    
    // WebSocket.send(JSON.stringify({
    //     'message': 'message was sent',
    //     'friendName': string,
    //     'type': 'init_call',
    // }))



    const servers = 
    {
        iceServers:[
            {
                urls:['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
    } 
    

    let setup_ui = async () => {
        console.log("test1")
        // Getting UI element    
        // let callBTN = document.getElementById("call-controls");
        let button = document.getElementById("ConControls-Call-icon");
        button.style.visibility = "hidden";
        // Getting chat element
        let chat = document.getElementsByClassName("message_container_chat")[0];
        let message_list = document.getElementsByClassName("message_list")[0];
        
        // Getting video elemnt
        let user1 = document.getElementById('user-1');
        let user2 = document.getElementById('user-2');

        // Getting permisson from the user
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}); // getting problem here

        console.log('test2')

        let video_container = document.getElementById("video_container");
        video_container.style.display = "grid"

        // Setting up video container style
        // callBTN.style.display = 'visible';
        user1.style.visibility = 'visible';
        user1.style.height = "100%";
        user2.style.visibility = 'visible';
        user2.style.height = "100%";
        isVisible = true
        // Setting up src stream for user 1
        user1.srcObject = localStream;
        
        user1.onloadedmetadata = function(e) {
            user1.play();
        };

        // uiNav.style.height = "50vh";
        // chat.style.height = "45vh";
        message_list.style.height = "50vh";

        is_in_call = true;
    }

    // Changing layout of website
    let init_call = async () =>
    {
        friend_call = string
        setup_ui()

        create_offer()
        
        // alert("ended");
    }

    let createPeerConnection = async () => {
        // Creating connection object
        peerConnection = new RTCPeerConnection(servers)

        // Creating friend's stream object
        remoteStream = new MediaStream()
        // Setting html video object to friend's stream
        document.getElementById('user-2').srcObject = remoteStream;

        if(!localStream){
            localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
            document.getElementById('user-1').srcObject = localStream
        }

        // For every track, tracks are added to localStream (user's stream)
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream)
        })

        // For every track from friend's peer connection, tracks are added to remoteStream (Friend's stream)
        peerConnection.ontrack = (e) => {
            e.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
        }

        // Debuging
        peerConnection.onicecandidate = async (e) => {
            if(e.candidate){
                // console.log('New ICE candidate: ', e.candidate)
                WebSocket.send(JSON.stringify({
                    'message': e.candidate,
                    'friendName': string,
                    'type': 'candidate',
                }))
            }
        }
    }

    let create_offer = async () => 
    {
        await createPeerConnection()

        let offer = await peerConnection.createOffer()
        // sets local descirpiton and also fires of peerConnection.onicecandidate listener
        await peerConnection.setLocalDescription(offer)

        const delay = ms => new Promise(
            resolve => setTimeout(resolve, ms)
        );
        await delay(200)

        WebSocket.send(JSON.stringify({
            'message': offer,
            'friendName': string,
            'type': 'init_call',
        }))
        // console.log('Offer: ', offer)
        // console.log(peerConnection)
    }

    let create_answer = async (offer) => {
        await createPeerConnection()

        await peerConnection.setRemoteDescription(offer)

        let answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)

        // console.log(string)
        console.log("asnwer: |")
        console.log(answer)
        // creating delay to ensure that aswer is created before sending message
        // if not first init of the call wont work :( (I have absolutely no idea how to fix this)
        const delay = ms => new Promise(
            resolve => setTimeout(resolve, ms)
        );
        await delay(400)
        WebSocket.send(JSON.stringify({
            'message': answer,
            'friendName': string,
            'type': 'answer',
        }))

    }

    let addAnswer = async (answer) => {
        // console.log("tests: ")
        // console.log(peerConnection)
        if (!peerConnection.currentRemoteDescription) {
            // console.log(peerConnection) 
            console.log(peerConnection.currentRemoteDescription)
            // count++
            await peerConnection.setRemoteDescription(answer);
        }
      };

    let handleCallFromPeer = async (data) => {
        // quick delay hack (not working in this case :( i hate life )
        // const delay = ms => new Promise(
        //     resolve => setTimeout(resolve, ms)
        // );
        // await delay(300)
        if (data)
        {
            // Debuggin stuff
            // if (data.friend == string)
            // {
            //     console.log(data)
            // }
            // If data is type init_call and was send from a friend
            if (data.type == "init_call" && data.friend == string)
            {
                // Setting flag that will fire off ui calling prompt
                isCalling = true
                // Getting accept_call button and adding event listener onclick 
                // that will fire of createReqeust function with passed 'data' param
                let button = document.getElementById("call_request_accept_call")
                button.addEventListener("click", createRequest)
                button.myParam = data
            }
            
            if (data.message.type === "answer" && data.friend == string)
            {
                // Adding answer
                addAnswer(data.message)
                // console.log("add_answer")
                // console.log(data.message)
            }
            
            if (data.type == "candidate" && data.friend == string)
            {
                // creating delay hack to ensure that create_answer() sends answer object first via websocket
                // possible fix:
                // create system where peer has to accept call and this will ensure time buffer betweem adding Ice Candidates and receiving answer object
                // answer object must be received before adding any Ice Candidates if not Ice Candidates on peer side will be added to null local description (that will throw error)
                const delay = ms => new Promise(
                    resolve => setTimeout(resolve, ms)
                );
                await delay(1000)
                console.log("ice tests")
                if(peerConnection){
                    console.log(peerConnection.remoteDescription)
                    peerConnection.addIceCandidate(data.message)

                    console.log("addIceCandidate")
                }
            }

            if (data.type == "end_call" && is_in_call && friend_call == data.friend)
            {
                handleUserLeft()
            }
        }

        // isCalling(false)
    }
    
    // Creating positive answer to call 
    let createRequest = async (data) => {

        // Saving friend name that user is in call with to var
        friend_call = data.currentTarget.myParam.friend
        // Changing ui 
        setup_ui()
        // Creating answer ice object and sending it to a peer 
        create_answer(data.currentTarget.myParam.message)
        
        // Making ui call request disappear
        isCalling = false
    }

    // TO FIX: object stream bug, in new call
    let handleUserLeft = async () => {
        
        // Getting html element
        let uiNav = document.getElementsByClassName("ConControls")[0];
        // Getting whole div that contains input message and list message
        let chat = document.getElementsByClassName("message_container_chat")[0];
        // Getting list that contains messages
        let message_list = document.getElementsByClassName("message_list")[0];

        // Changing back height setting
        uiNav.style.height = "auto";
        chat.style.height = "auto";
        // Setting message list to 85% of website height
        message_list.style.height = "85vh";
        
        // Getting html call button (green button that init the call)
        let button = document.getElementById("ConControls-Call-icon");
        // Making button visible again
        button.style.visibility = "visible";
        
        // Making div that contains video objects invisible
        let video_container = document.getElementById("video_container");
        video_container.style.display = "none"
        
        // Getting users video objects
        let user1 = document.getElementById('user-1');
        let user2 = document.getElementById('user-2');
        
        // Making them also invinsible 
        user1.style.visibility = 'hidden';
        user1.style.height = "0%";
        user2.style.visibility = 'hidden';
        user2.style.height = "0%";
        
        // Setting flags to false
        isVisible = false
        is_in_call = false
        isCalling = false
        
        // Testing/debuggin/fixing bugs

        // localStream.getTracks().forEach((track) => {
            //     track.stop();
            // })

        // For every track, tracks are added to localStream (user's stream)
        
    
        // console.log(peerConnection.getSenders())
        // peerConnection.removeTrack(peerConnection.getSenders()[0])

        // let videoTrack = localStream.getTracks().find(track => track.kind === 'video')
        // localStream.getTracks().forEach((track) => {
        //     console.log(track)
        //     // track.stop();
        //     localStream.removeTrack(track)
        // })

        // closing peer connection (sets connection to 'close' status, it doesn't destroying connection)
        peerConnection.close()
        // Temporary fix to object stream bug
        window.location.reload()
        // removeTrack()
        
        // Sending to peer 'end_call' prompt
        WebSocket.send(JSON.stringify({
            'message': 'end call',
            'friendName': string,
            'type': 'end_call',
        }))
    }

    // Denying incoming call
    let deny_call = () => {
        isCalling = false

        // Sending to peer 'end_call' prompt 
        WebSocket.send(JSON.stringify({
            'message': 'end call',
            'friendName': string,
            'type': 'end_call',
        }))
    }

    // Toggle user's stream camera
    let toggle_camera = async () => {
        // Getting user's stream object
        let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

        if (videoTrack.enabled)
        {
            // Disabling video src
            videoTrack.enabled = false
            // Setting background color of button to red
            document.getElementById('camera_btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }
        else
        {
            // Enabling video src
            videoTrack.enabled = true
            // Setting background color of button to blue
            document.getElementById('camera_btn').style.backgroundColor = 'rgb(102, 153, 255, .8)'
        }
    }

    // Taggle user's stream audio
    let toggle_audio = async () => {
        // Getting user's stream object
        let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

        if (audioTrack.enabled)
        {
            // Disabling audio src
            audioTrack.enabled = false
            // Changing button background to red
            document.getElementById('mic_btn').style.backgroundColor = 'rgb(255, 80, 80)'
        }
        else
        {
            // Enabling audio src
            audioTrack.enabled = true
            // Changing button background to blue
            document.getElementById('mic_btn').style.backgroundColor = 'rgb(102, 153, 255, .8)'
        }
    }
    
    
    useEffect(()=> {
        // Adding event listenr that checks if user refreshed/close tab
        window.addEventListener('beforeunload', handleUserLeft)
        // if(is_in_call === true)
        // {
        //     init_call()
        // }
        // else
        // {
        //     // Getting UI element    
        //     let uiNav = document.getElementsByClassName("ConControls")[0];
        //     // Getting chat element
        //     let chat = document.getElementsByClassName("message_container_chat")[0];
        //     let message_list = document.getElementsByClassName("message_list")[0];
        //     uiNav.style.height = "auto";
        //     chat.style.height = "auto";
        //     message_list.style.height = "85vh";
        // }
        // // setup_ui()

        // setIsVisible(false)
    }, [])

    // Logic for handling incoming call
    handleCallFromPeer(data)
    
    return (
        <div className='main_uivideo_con'>
            <div className='ConControls'>
                <div id='ConControls-friendname'>{username}</div>
                <div id='ConControls-Call-icon' onClick={init_call}><img src={CallIcon} alt="call"/></div>
            </div>
            <div className='video_container' id='video_container' hidden>
                <video class="video-player" id='user-1' autoPlay playsInline ></video>
                <video class="video-player" id='user-2' autoPlay playsInline ></video>
            </div>
            <div className={isCalling ? 'visible' : 'hidden'} id='call_request'>
                <div id='call_request_text'>
                    {string} is calling you!
                </div>
                <div id='call_request_controls'>
                    <div className='control-container' id='call_request_accept_call'>
                        <img src={PhoneIcon} alt='accept_call' />
                    </div>
                    <div className='control-container' id='leave_btn' onClick={deny_call}>
                        <img src={EndCall} alt='deny_call'/>
                    </div>
                </div>
            </div>
            <div className={isVisible ? 'visible' : 'hidden'} id='call_controls'>
                <div class="control-container" id="camera_btn" onClick={toggle_camera}>
                    <img src={CameraIcon} alt='camera_btn' />
                </div>
                <div class="control-container" id="mic_btn" onClick={toggle_audio}>
                    <img src={MicIcon} alt='microphone_btn' />
                </div>
                <div class="control-container" id="leave_btn" onClick={handleUserLeft}>
                    <img src={PhoneIcon} alt='leave_btn' />
                </div>
            </div>
        </div>
    )
}

export default ConControls