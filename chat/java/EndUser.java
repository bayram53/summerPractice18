package user;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

public class EndUser {
    public static void main(String[] args) throws IOException {
        
        if (args.length != 0) {
          System.err.println("Usage: java User");
          System.exit(1);
        }
        
        String hostName = "127.0.0.1";
        int portNumber = 8005;

        try (Socket echoSocket = new Socket(hostName, portNumber);
            PrintWriter out = new PrintWriter(echoSocket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(echoSocket.getInputStream()));
            BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in))) {
            
            System.out.print("Please enter username and password.\n> ");
            
            String userInput;
            String serverInput;
            
            while ((userInput = stdIn.readLine()) != null) {
                
                out.println(userInput);
                while((serverInput = in.readLine()) == null);
                
                if(serverInput.length() < 2){
                    continue;
                }
                
                serverInput = serverInput.replace('~', '\n');
                
                // 00 => admin successfully login
                // 0x => user succesfully login
                // 10 => output from operation
                // 1x => operation done sucessfully
                
                if(serverInput.charAt(0) == '0'){
                    System.out.println("Login is successfully established");
                    System.out.println("You can do following operations in this mailbox");
                    System.out.println("send <username> <message>");
                    System.out.println("read <in> [or] <out>");

                    if(serverInput.charAt(1) == '1'){ // admin
                        System.out.println("create <username> <name> <surname> <birth date> <email> <gender>");
                        System.out.println("read info <username>");
                        System.out.println("update info <username> <username/name/surname/birthdate/email/gender/password> <new value>");
                        System.out.println("delete <username>");
                        System.out.println("Note: only username with admin can create or delete admin type user");
                    }
                    
                    /*
                    if(serverInput.length() > 2){
                        System.out.println("This user is currently in use by other client");
                        System.exit(1);
                    }
                    */
                }
                else if(serverInput.charAt(0) == '1'){
                    if(serverInput.charAt(1) == '0')
                        System.out.println(serverInput.substring(3));
                }
                else
                    System.out.println("Unexpected input from server");
                
                System.out.print("> ");
            }
        }catch (UnknownHostException e) {
            System.err.println("Don't know about host " + hostName);
            System.exit(1);
        }catch (IOException e) {
            System.err.println("Couldn't get I/O for the connection to " + hostName);
            System.exit(1);
        } 
    }
}

