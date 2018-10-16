/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package projectfinal;

/**
 *
 * @author bayram
 */

import java.sql.*;
import java.lang.ThreadLocal;

public class User {
    public String username;
    public String name;
    public String surname;
    public String birthDate;
    public String gender;
    public String email;
    public String type;
    public String pass;
    
    User(){
        
    }
    
    User(String username, String name, String surname, String birthDate, String email,
            String gender, String type, String password){
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;
        this.type = type;
        this.pass = password;
    }
}
