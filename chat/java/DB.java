/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package projectfinal;
import java.sql.*;

/**
 *
 * @author bayram
 */
public class DB {
    private final static Object snc = new Object();
    static PreparedStatement add_user;      // for adding new user
    static PreparedStatement delete_user;   // for deleting user
    static PreparedStatement update_user;   // for upadating user
    static PreparedStatement read_user;     // for reading user
    static PreparedStatement add_message;   // for adding new message
    static PreparedStatement get_message;   // for reading messages
    static PreparedStatement check_user;    // it checks for autentication to log in
    static Statement stmt;                  // maybe used for other 
    
    
    public static void init(){
        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/DataBaseFor1?useSSL=false","root","passwords");  
            
            stmt = con.createStatement();/*
            add_user = con.prepareStatement("");
            delete_user = con.prepareStatement("");
            update_user = con.prepareStatement("");
            read_user = con.prepareStatement("");
            add_message = con.prepareStatement("");
            get_message = con.prepareStatement("");*/
            
        } catch(Exception e){
            System.out.println(e);
        }
    }
    
    public static Boolean addUser(User u){
        try{
            return execute("insert into Users(username,name,surname,birthDate,gender,email,type,password) "
                    + "values('" + u.username + "','" + u.name + "','" + u.surname + "','" + u.birthDate
                    + "','"  + u.gender + "','" + u.email + "','" + u.type + "','" + u.pass + "')");
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
        
    }
    
    public static Boolean deleteUser(String username){
        System.out.println("delete from Users where username='" + username + "'");
        try{
            return execute("delete from Users where username='" + username + "'");
        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }
    
    public static Boolean updateUser(User u, String oldName){
        System.out.println("Update Users "
                    + "set username='" + u.username + "', name='" + u.name + "', surname='" + u.surname 
                    + "', birthDate='" + u.birthDate + "', gender='" + u.gender + "', email='" + u.email
                    + "', type='" + u.type + "', password='" + u.pass
                    + "where username='" + oldName + "'");
        try{
            return execute("Update Users "
                    + "set username='" + u.username + "', name='" + u.name + "', surname='" + u.surname 
                    + "', birthDate='" + u.birthDate + "', gender='" + u.gender + "', email='" + u.email
                    + "', type='" + u.type + "', password='" + u.pass
                    + "'where username='" + oldName + "'");
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static User readUser(String username){
        try{
            
            ResultSet res = executeQuery("select * from Users where username='" + username + "'");
            res.next();
            
            return new User(res.getString("username"), res.getString("name"), res.getString("surname"),
                    res.getString("birthDate"), res.getString("email"), res.getString("gender"),
                    res.getString("type"), res.getString("password"));
        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }
    
    public static Boolean addMessage(String from, String to, String msg){
        java.util.Date dt = new java.util.Date();
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String currentTime = sdf.format(dt);
        
        try{
            return execute("insert into Messages(sender,reciever,msg,time) "
                    + "values('" + from + "','" + to + "','" + msg + "','" +  currentTime + "')");
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static String readMessage(String username, String type){
        try{
            String a = "sender";
            String b = "reciever";
            if(type.equals("in")){
                a = "reciever";
                b = "sender";
            }
            
            ResultSet res = executeQuery("select " + b + ",time,msg from Messages "
                    + "where " + a + "='" + username + "'");
            
            if(res.next() == false){
                return "There is no " + type + "box message.";
            }
            
            String ret = null;
            
            do{
                if(ret == null)
                    ret = "";
                else
                    ret += "~";
                
                ret += res.getString(b) + " [" + res.getString("time") + "]: " + res.getString("msg");
            }while(res.next());
            
            return ret;
            
        } catch(Exception e){
            System.out.println(e);
            return "Unexpected error in sql";
        }
    }
    
    public static Boolean execute(String query) throws Exception{
        synchronized(snc){
            return stmt.execute(query);
        }
    }
    
    public static ResultSet executeQuery(String query) throws Exception{
        synchronized(snc){
            return stmt.executeQuery(query);
        }
    }
    
    public static Boolean checkUser(String username){
        try{
            ResultSet res = executeQuery("select username from Users where username='" + username + "'");
            return res.next();
        } catch(Exception e){
            System.out.println(e);
            return false;
        }
    }
    
    public static int checkUserPassword(String username, String password){
        try{
            ResultSet res = executeQuery("select password,type from Users where username='" + username + "'");
            res.next();
            if(password.equals(res.getString(1))){
                if("admin".equals(res.getString(2)))
                    return 2;
                return 1;
            }
            else
                return 0;
        } catch(Exception e){
            System.out.println(e);
            return 0;
        }
    }
}
