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
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


public class Server {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        
        DB.init();
        
        if(args.length == 1){
            if(args[0].equals("format")){
                
                try{
                    DB.execute("drop table Users");
                    DB.execute("drop table Messages");
                    
                    DB.execute("reate table Users( username varchar(20) not null primary key," +
                    "name varchar(20) not null," +
                    "surname varchar(20) not null," +
                    "birthDate varchar(10)," +
                    "gender char," +
                    "email varchar(20)," +
                    "type varchar(20) not null," +
                    "password varchar(20))");
                    
                    DB.execute("create table Messages( sender varchar(20),"
                            + " id int not null auto_increment,"
                            + " reciever varchar(20),"
                            + "  msg varchar(255),"
                            + " time datetime,"
                            + " foreign key(sender) references Users(username) on delete set NULL on update cascade,"
                            + " foreign key(reciever) references Users(username) on delete set NULL on update cascade,"
                            + " primary key(id) )");
                    DB.execute("insert into Users values('admin', 'admin', 'admin', '-', '-', 'admin@gmail.com', 'admin', 'enter')");
                    
                } catch(Exception e){
                    System.err.println(e);
                }
            }
            else{
                System.err.println("Usage: <java Server format> to delete everything and start, "
                        + "do not use argument to start normally");
            }
        }
        
        int portNumber = 8005;
        ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors.newCachedThreadPool();
        executor.setKeepAliveTime(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
        
        try(ServerSocket serverSocket = new ServerSocket(portNumber);){
            
            System.out.println("Waiting for clients");
            
            while(true){
                Socket clientSocket = serverSocket.accept();
                Runnable worker = new RequestHandler(clientSocket);
                executor.execute(worker);
            }
            
        } catch(IOException e){
            System.err.println(e);
        } finally{
            executor.shutdown();
        }
    }
    
}
