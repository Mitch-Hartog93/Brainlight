//
//  SIgnUpViewController.swift
//  Brainlight
//
//  Created by Mitch Hartog on 08/10/2020.
//

import UIKit
import FirebaseAuth
import Firebase
import FirebaseFirestore

class SignUpViewController: UIViewController {
    
    
    // 1. HERE ARE THE BUTTONS AND STUFF THAT WE CONNECTED VIA STORYBOARD
    @IBOutlet weak var firstNameTextField: UITextField!
    
    @IBOutlet weak var lastNameTextField: UITextField!
    
    @IBOutlet weak var emailTextField: UITextField!
    
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var signUpButton: UIButton!
    
    @IBOutlet weak var errorLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        
    
        assignbackground()
        setUpElements()
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

        // Do any additional setup after loading the view.
       
    }
    
    
    // 2. STYLING BUTTONS & LABELS
    func setUpElements() {
        // 2.1 Hiding the error label
        errorLabel.alpha = 0
        
      
           
        // 2.2 Style of the Elements
        Utilities.styleFilledButton(signUpButton)
        Utilities.styleTextField(firstNameTextField)
        Utilities.styleTextField(lastNameTextField)
        Utilities.styleTextField(emailTextField)
        Utilities.styleTextField(passwordTextField)
        
        
    }
    
    
    // 3. VALIDATING THE FIELDS ON THIS SCREEN (Check the fields and validate that the data is correct. If everything is correct, this method returns nil. Otherwise, it returns the error message)
    func validateFields() -> String? {
        
        // 3.1 check that all fields are filled in
        if      firstNameTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == ""
                || lastNameTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == ""
                || emailTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == ""
                || passwordTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == ""
        {
            return "Vul alle velden in."
        }
        
        // 3.2 check if the password is secure
        let cleanedPassword = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if Utilities.isPasswordValid(cleanedPassword) == false {
            // Password isn't secure enough:
            return "Zorg er voor dat het wachtwoord tenminste 8 karakters, 1 speciaal karakter en een nummer bevat."
        }
        
        return nil
    }
    
    
    
    // 4. WHEN SOMEONE PUSHES THE SIGN UP BUTTON, FIELDS ARE VALIDATED, USER MUST BE CREATED AND USER SHOULD BE LED TO HOME SCREEN
    @IBAction func signUpTapped(_ sender: Any) {
        
        // 4.1 Validate the fields
        let error = validateFields()
        
        if error != nil {
            
            // There's something wrong with the fields, show error message
            showError(error!)
        }
        else {
        
        // 4.2 Create cleaned versions of the data
            let firstName = firstNameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let lastName = lastNameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let email = emailTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let password = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            
        // 4.3 Create the user
        Auth.auth().createUser(withEmail: email, password: password) { (result, err) in
            // Check for errors
            if err != nil {
                
                // There was an error creating the user
                self.showError("Error creathing user")
            }
            else {
                
                // User was created succesfully, now store the first name and last name
                let db = Firestore.firestore()
                
                db.collection("users").addDocument(data: ["firstname":firstName, "lastname":lastName, "uid": result!.user.uid]) { (error) in
                    if error != nil {
                        
                        // Show error message
                        self.showError("Error saving user data")
                    }
                }
                
         // 4.4 Transition to the home screen
                self.transitionToHome()
            }
        }
        
        
        }
        
    }
    
    func showError(_ message:String) {
        
        errorLabel.text = message
        errorLabel.alpha = 1
    }
    
    func transitionToHome() {
        
        let infoViewController = storyboard?.instantiateViewController(identifier: Constants.Storyboard.infoViewController) as? InfoViewController
        
        view.window?.rootViewController = infoViewController
        view.window?.makeKeyAndVisible()
    }
    
}

