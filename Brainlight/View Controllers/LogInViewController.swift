//
//  LogInViewController.swift
//  Brainlight
//
//  Created by Mitch Hartog on 08/10/2020.
//

import UIKit
import FirebaseAuth

class LogInViewController: UIViewController {
    
    
    // 1. HERE ARE THE BUTTONS THAT WE CONNECTED VIA THE STORYBOARD
    
    @IBOutlet weak var emailTextField: UITextField!
    
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var loginButton: UIButton!
    
    @IBOutlet weak var errorLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        setUpElements()
        assignbackground()
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
        
    }
    
    // 2. STYLING THE BUTTONS AND LABELS
    func setUpElements() {
        
        // 2.1 Hiding the error label
        errorLabel.alpha = 0
        
        // 2.2 Styling the elements
        Utilities.styleFilledButton(loginButton)
        Utilities.styleTextField(emailTextField)
        Utilities.styleTextField(passwordTextField)
        
        
        
    }


    // 3. THIS IS THE LOGIN BUTTON WHEN IT IS TAPPED
    @IBAction func loginTapped(_ sender: Any) {
    
        // 3.1 Validate Text Fields
        
        // 3.2 Create cleaned versions of the text field
        let email = emailTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        let password = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        
        
        // 3.3 Signing in the user
        Auth.auth().signIn(withEmail: email, password: password) { (result, error) in
            
            if error != nil {
                // Couldn't sign in
                self.errorLabel.text = error!.localizedDescription
                self.errorLabel.alpha = 1
            }
            else {
                
                let infoViewController = self.storyboard?.instantiateViewController(identifier: Constants.Storyboard.infoViewController) as? InfoViewController
                
                self.view.window?.rootViewController = infoViewController
                self.view.window?.makeKeyAndVisible()
                
            }
        }
    }
    

}
