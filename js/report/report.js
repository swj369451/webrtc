async function reportInfo(ps,targetId){
    let messageSpan = document.getElementById(`message-${targetId}`)
    let message="";
    // handleTransport(ps.getReceivers()[1].transport.iceTransport);
    let id = setInterval(() => {
        if(messageSpan!=null){
            message="";
            message+=`【connectionState】=${ps.connectionState}`;
            message+=`【iceConnectionState】=${ps.iceConnectionState}`;
            message+=`【iceGatheringState】=${ps.iceGatheringState}`;
            message+=`【signalingState】=${ps.signalingState}<br/>`;
            
            message+=`-------------senders---------------<br/>`;
            ps.getSenders().forEach(function(sender){
                message+=`${sender.track.kind}
                -【enabled】=${sender.track.enabled}
                -【readyState】=${sender.track.readyState}
                -【muted】=${sender.track.muted}<br/>
                -【transport-state】=${sender.transport.state}
                -【iceTransport-state】=${sender.transport.iceTransport.state}<br/>
                -【SelectedCandidatePair-local】=<br/>${sender.transport.iceTransport.getSelectedCandidatePair()?.local.candidate}<br/>
                -【SelectedCandidatePair-remote】=<br/>${sender.transport.iceTransport.getSelectedCandidatePair()?.remote.candidate}<br/>`;
            })

            message+=`-------------receivers---------------<br/>`;
            ps.getReceivers().forEach(function(receiver){
                message+=`${receiver.track.kind}
                -【enabled】=${receiver.track.enabled}
                -【readyState】=${receiver.track.readyState}
                -【muted】=${receiver.track.muted}<br/>
                -【transport-state】=${receiver.transport.state}
                -【iceTransport-state】=${receiver.transport.iceTransport.state}<br/>
                -【SelectedCandidatePair-local】=<br/>${receiver.transport.iceTransport.getSelectedCandidatePair()?.local.candidate}<br/>
                -【SelectedCandidatePair-remote】=<br/>${receiver.transport.iceTransport.getSelectedCandidatePair()?.remote.candidate}<br/>`;
                
            })


            messageSpan.innerHTML=message;
        }else{
            clearInterval(id);
        }

    }, 1000);
}
// async function handleTransport(iceTransport){
//     iceTransport.ongatheringstatechange = function(event){
//         console.log();
//     }
//     iceTransport.onselectedcandidatepairchange = function(event){
//         console.log();
//     }
//     iceTransport.onstatechange = function(event){
//         console.log();
//     }
// }

export { reportInfo }