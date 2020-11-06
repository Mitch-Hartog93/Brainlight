//
//  VideoController.swift
//  Brainlight
//
//  Created by Mitch Hartog on 26/10/2020.
//

import Foundation
import UIKit
import AVKit
import AVFoundation

class VideoController: UIViewController {
    
    private var player: AVQueuePlayer!
    private var playerLayer: AVPlayerLayer!
    private var playerItem: AVPlayerItem!
    private var playerLooper: AVPlayerLooper!

    override func viewDidLoad(){
        super.viewDidLoad()

        let path = Bundle.main.path(forResource: "flickering", ofType: "mp4")
        let pathURL = URL(fileURLWithPath: path!)
        let duration = Int64( ( (Float64(CMTimeGetSeconds(AVAsset(url: pathURL).duration)) *  10.0) - 1) / 10.0 )

        player = AVQueuePlayer()
        playerLayer = AVPlayerLayer(player: player)
        playerItem = AVPlayerItem(url: pathURL)
        playerLooper = AVPlayerLooper(player: player!, templateItem: playerItem,
                                      timeRange: CMTimeRange(start: CMTime.zero, end: CMTimeMake(value: duration, timescale: 1)) )
        playerLayer.videoGravity = AVLayerVideoGravity.resizeAspectFill
        playerLayer.frame = view.layer.bounds
        view.layer.insertSublayer(playerLayer, at: 1)
        
        player.play()
        
        
    }
}
