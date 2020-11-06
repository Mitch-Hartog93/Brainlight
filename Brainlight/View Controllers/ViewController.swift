//
//  ViewController.swift
//  Brainlight
//
//  Created by Mitch Hartog on 08/10/2020.
//

import UIKit
import SwiftUI

        
class ViewController: UIViewController {
    

    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var logInButton: UIButton!
    @IBOutlet weak var logo: UIImageView!
    
    
    
    

    override func viewDidLoad() {
                    super.viewDidLoad()
        
          self.navigationController!.navigationBar.setBackgroundImage(UIImage(), for: .default)
          self.navigationController!.navigationBar.shadowImage = UIImage()
          self.navigationController!.navigationBar.isTranslucent = true
                    adjustLogo()
                    assignbackground()
                   // Do any additional setup after loading the view.
               }

         func assignbackground(){
               let background = UIImage(named: "background2")

               var imageView : UIImageView!
               imageView = UIImageView(frame: view.bounds)
               imageView.contentMode =  UIView.ContentMode.scaleAspectFill
               imageView.clipsToBounds = true
               imageView.image = background
               imageView.center = view.center
               view.addSubview(imageView)
               view.sendSubviewToBack(imageView)

            setUpElements()
        
    }
    
    func adjustLogo() {
        
        logo.layer.shadowColor = UIColor.black.cgColor
        logo.layer.shadowOffset = .zero
        logo.layer.shadowOpacity = 1
        logo.layer.shadowRadius = 1.0
        logo.clipsToBounds = false
        logo.layer.shadowOffset = .zero
        
    }
    func setUpElements() {
        
        Utilities.styleHollowButton(signUpButton)
        Utilities.styleFilledButton(logInButton)
        
    }

}
