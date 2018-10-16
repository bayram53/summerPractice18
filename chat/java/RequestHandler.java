/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package projectfinal;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.sql.*;
import java.io.*;
import java.util.*;
/**
 *
 * @author bayram
 */
public class RequestHandler implements Runnable {
    private Socket client;
    static ArrayList<User> Users;
    ThreadLocal<User> now;
    
    RequestHandler(Socket _client){
        this.client = _client;
    }
    
    public void run(){
        try ( BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
	BufferedWriter out = new BufferedWriter(new OutputStreamWriter(client.getOutputStream()));) {
	
        String userInput;
	
        int state = 0; // 0 => not logged in, 1 logged in
        String username = "";
        int type = 0; // 2 => admin, 1 => not admin
        int exit = 0;
        
        while ((userInput = in.readLine()) != null) {
            
            String arr[] = userInput.split(" ");
            String msg = null;
            int tmp;
            
            System.out.println("I got input <" + userInput + ">");
            
            if(state == 0){ // expecting login information
                if(arr.length != 2){
                    msg = "10 You entered more than or less than 2 entries";
                }
                else if((tmp = DB.checkUserPassword(arr[0], arr[1])) > 0){
                    msg = "00";
                    type = 1;
                    
                    if(tmp == 2){
                        msg = "01";
                        type = 2;
                    }
                    
                    username = arr[0];
                    
                    state = 1;
                }
                else{
                    msg = "10 username or password is incorrect";
                }
            }
            else{ // logged in
                User now;
                
                if(arr[0].equals("create")  &&  type == 2){
                    //System.out.println("create <username> <name> <surname> <birth date> <email> <gender>");
                    
                    if(DB.checkUser(arr[1])){
                        msg = "10 There is already user with '" + arr[1] + "' username";
                    }
                    else if(arr.length != 8){
                        msg = "10 Please provide only neccessary informations";
                    }
                    else{System.out.println("what is goin on?");
                        now = new User(arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], "normal", arr[7]);
                        
                        now.name.toLowerCase();
                        now.surname.toLowerCase();
                        now.gender.toUpperCase();
                        
                        System.out.println("what is goin on?");
                        
                        DB.addUser(now);
                        msg = "10 User has been succesfully added";
                    }
                }
                else if(arr[0].equals("read")  &&  arr[1].equals("info")  &&  type == 2){
                    if(DB.checkUser(arr[2]) == false){
                        msg = "10 There is no such username";
                    }
                    else{
                        now = DB.readUser(arr[2]);
                        
                        msg = "10 " 
                        + "username: " + now.username + "~"
                        + "name surname: " + now.name + " " + now.surname + "~"
                        + "birth date: " + now.birthDate + "~"
                        + "email: " + now.email + "~"
                        + "gender: " + now.gender + "~"
                        + "type: " + now.type; 
                    }
                }
                else if(arr[0].equals("update")  &&  type == 2){
                    if(arr.length != 4){
                        msg = "10 You should enter three entries";
                    }
                    else{
                        now = DB.readUser(arr[1]);
                        int done = 1;
                        
                        if(arr[2].equals("username")){
                            if(DB.checkUser(arr[3]) == true){
                                msg = "10 username is already in use";
                                done = 0;
                            }
                            else
                                now.username = arr[3];
                        }
                        else if(arr[2].equals("name")){
                            now.name = arr[3];
                        }
                        else if(arr[2].equals("surname")){
                            now.surname = arr[3];
                        }
                        else if(arr[2].equals("birthdate")){
                            now.birthDate = arr[3];
                        }
                        else if(arr[2].equals("email")){
                            now.email = arr[3];
                        }
                        else if(arr[2].equals("gender")){
                            now.gender = arr[3].toUpperCase();
                        }
                        else if(arr[2].equals("password")){
                            now.pass = arr[3];
                        }
                        else{
                            msg = "10 Incorrect info entered";
                            done = 0;
                        }
                        
                        if(done == 1){
                            if( DB.updateUser(now, username) == true){
                                msg = "10 Update succesfully completed";
                            }
                            else{
                                msg = "10 Got error while upadting please try again";
                            }
                        }
                    }
                    
                }
                else if(arr[0].equals("delete")  &&  type == 2){
                    if(DB.checkUser(arr[1]) == false){
                        msg = "10 There is no such user";
                    }
                    else{
                        if(username.equals(arr[1])){
                            msg = "10 You have deleted your user~user with username " + arr[1] + " deleted";
                            exit = 1;
                        }
                        else
                            msg = "10 user with username " + arr[1] +  " deleted";
                        
                        DB.deleteUser(arr[1]);
                        
                    }
                }
                else if(arr[0].equals("send")){
                    if(arr.length < 2)
                        msg  = "10 " + "no message is entered";
                    else{
                        if(DB.checkUser(arr[1]) == false){
                            msg = "10 " + "There is no such username";
                        }
                        else{
                            String m = arr[2];
                            
                            for(int i=3; i<arr.length; i++)
                                m = m + " " + arr[i];
                            
                            DB.addMessage(username, arr[1], m);
                            
                            msg = "11";
                        }
                    }
                }
                else if(arr[0].equals("read")){
                    if(arr.length != 2){
                        msg = "10 You should enter only in or out after read";
                    }
                    else{
                        if(arr[1].equals("in")  ||  arr[1].equals("out") ){
                            msg = "10 " + DB.readMessage(username, arr[1]);
                        }
                        else{
                            msg = "10 You should enter only in or out after read";
                        }
                    }
                }
                else if(arr[0].equals("exit")){
                    msg = "10 Bye";
                    exit = 1;
                }
                else{
                    msg = "10 Wrong operation entered";
                    System.out.println("Unexpected operation");
                }
            }
            
            out.write(msg);
            out.newLine();
            out.flush();
            
          //userInput=userInput.replaceAll("[^A-Za-z0-9 ]", "");
          
            if(exit == 1){
                while(true);
            }
	}
      } catch (IOException e) {
           System.out.println("I/O exception: " + e);
        } catch (Exception ex) {
	   System.out.println("Exception in Thread Run. Exception : " + ex);
	  }
    }
}
