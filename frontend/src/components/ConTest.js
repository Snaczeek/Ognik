import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import CallIcon from '../assets/phone-call.png';
import CameraIcon from '../assets/camera.png';
import MicIcon from '../assets/mic.png';
import PhoneIcon from '../assets/phone.png';
import EndCall from '../assets/end-call.png';
import AuthContext from '../context/AuthContext';

let localStream;
let remoteStream;
let peerConnection;
let is_in_call = false;
let friend_call = 'none';
let isCalling = false;

const ConControls = ({ data }) => {
  // Getting username from URL
  let { username } = useParams();
  let friendName = username.toString();

  let { WebSocket, authToken, user } = useContext(AuthContext);

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleUserLeft);
    return () => {
      window.removeEventListener('beforeunload', handleUserLeft);
    };
  }, []);

//   useEffect(() => {
//     if (WebSocket) {
//       WebSocket.onmessage = async (message) => {
//         console.log('Received ws message');
//         const data = JSON.parse(message.data);
//         await handleCallFromPeer(data);
//       };
//     }
//   }, [WebSocket]);

  const setupUI = async () => {
    const button = document.getElementById('ConControls-Call-icon');
    button.style.visibility = 'hidden';

    const message_list = document.getElementsByClassName('message_list')[0];
    const user1 = document.getElementById('user-1');
    const user2 = document.getElementById('user-2');

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    const video_container = document.getElementById('video_container');
    video_container.style.display = 'grid';

    user1.style.visibility = 'visible';
    user1.style.height = '100%';
    user2.style.visibility = 'visible';
    user2.style.height = '100%';

    user1.srcObject = localStream;
    user1.onloadedmetadata = function (e) {
      user1.play();
    //   user1.muted = true;
    };

    message_list.style.height = '50vh';

    is_in_call = true;
  };

  const init_call = async () => {
    friend_call = friendName;
    await setupUI();
    await createOffer();
  };

  const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById('user-1').srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (e) => {
      if (e.candidate) {
        WebSocket.send(
          JSON.stringify({
            message: e.candidate,
            friendName: friendName,
            type: 'candidate',
          })
        );
      }
    };
  };

  const createOffer = async () => {
    await createPeerConnection();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    WebSocket.send(
      JSON.stringify({
        message: offer,
        friendName: friendName,
        type: 'init_call',
      })
    );
  };

  const createAnswer = async (offer) => {
    await createPeerConnection();

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    WebSocket.send(
      JSON.stringify({
        message: answer,
        friendName: friendName,
        type: 'answer',
      })
    );
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(answer);
    }
  };

  const handleCallFromPeer = async (data) => {
    if (data) {
      if (data.type === 'init_call' && data.friend === friendName) {
        isCalling = true;
        const button = document.getElementById('call_request_accept_call');
        button.onclick = () => createRequest(data);
      } else if (data.message.type === 'answer' && data.friend === friendName) {
        await addAnswer(data.message);
      } else if (data.type === 'candidate' && data.friend === friendName) {
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.message));
        }
      } else if (data.type === 'end_call' && is_in_call && friend_call === data.friend) {
        handleUserLeft();
      }
    }
  };

  const createRequest = async (data) => {
    friend_call = data.friend;
    await setupUI();
    await createAnswer(data.message);
    isCalling = false;
  };

  const handleUserLeft = async () => {
    const uiNav = document.getElementsByClassName('ConControls')[0];
    const chat = document.getElementsByClassName('message_container_chat')[0];
    const message_list = document.getElementsByClassName('message_list')[0];

    uiNav.style.height = 'auto';
    chat.style.height = 'auto';
    message_list.style.height = '85vh';

    const button = document.getElementById('ConControls-Call-icon');
    button.style.visibility = 'visible';

    const video_container = document.getElementById('video_container');
    video_container.style.display = 'none';

    const user1 = document.getElementById('user-1');
    const user2 = document.getElementById('user-2');

    user1.style.visibility = 'hidden';
    user1.style.height = '0%';
    user2.style.visibility = 'hidden';
    user2.style.height = '0%';

    is_in_call = false;
    isCalling = false;

    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.close();
      peerConnection = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteStream = null;
    }

    WebSocket.send(
      JSON.stringify({
        message: 'end call',
        friendName: friendName,
        type: 'end_call',
      })
    );

    window.location.reload();
  };

  const deny_call = () => {
    isCalling = false;
    WebSocket.send(
      JSON.stringify({
        message: 'end call',
        friendName: friendName,
        type: 'end_call',
      })
    );
  };

  const toggle_camera = () => {
    const videoTrack = localStream.getTracks().find((track) => track.kind === 'video');
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById('camera_btn').style.backgroundColor = 'rgb(255, 80, 80)';
    } else {
      videoTrack.enabled = true;
      document.getElementById('camera_btn').style.backgroundColor = 'rgb(102, 153, 255, .8)';
    }
  };

  const toggle_audio = () => {
    const audioTrack = localStream.getTracks().find((track) => track.kind === 'audio');
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      document.getElementById('mic_btn').style.backgroundColor = 'rgb(255, 80, 80)';
    } else {
      audioTrack.enabled = true;
      document.getElementById('mic_btn').style.backgroundColor = 'rgb(102, 153, 255, .8)';
    }
  };

  handleCallFromPeer(data);

  return (
    <div className='main_uivideo_con'>
      <div className='ConControls'>
        <div id='ConControls-friendname'>{username}</div>
        <div id='ConControls-Call-icon' onClick={init_call}>
          <img src={CallIcon} alt='call' />
        </div>
      </div>
      <div className='video_container' id='video_container' hidden>
        <video className='video-player' id='user-1' autoPlay playsInline muted></video>
        <video className='video-player' id='user-2' autoPlay playsInline></video>
      </div>
      <div className={isCalling ? 'visible' : 'hidden'} id='call_request'>
        <div id='call_request_text'>{username} is calling you!</div>
        <div id='call_request_controls'>
          <div className='control-container' id='call_request_accept_call'>
            <img src={PhoneIcon} alt='accept_call' />
          </div>
          <div className='control-container' id='leave_btn' onClick={deny_call}>
            <img src={EndCall} alt='deny_call' />
          </div>
        </div>
      </div>
      <div className={is_in_call ? 'visible' : 'hidden'} id='call_controls'>
        <div className='control-container' id='camera_btn' onClick={toggle_camera}>
          <img src={CameraIcon} alt='camera_btn' />
        </div>
        <div className='control-container' id='mic_btn' onClick={toggle_audio}>
          <img src={MicIcon} alt='mic_btn' />
        </div>
        <div className='control-container' id='leave_btn' onClick={handleUserLeft}>
          <img src={PhoneIcon} alt='leave_btn' />
        </div>
      </div>
    </div>
  );
};

export default ConControls;
