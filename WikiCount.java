
//package com.mkyong;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.StringTokenizer;
import java.util.TreeMap;
import java.util.Comparator;


public class WikiCount {	
    //String userName;
    //String inputFileName;
	
	private static final String FILENAME = "/users/Althea/desktop/JAVA/pagecounts-20160801-030000.en.txt";
	
    //BufferedReader br = new BufferedReader(new FileReader("/users/Althea/desktop/JAVA/pagecounts-20160801-030000.en.txt"));
	HashMap<String, Integer> hashMap = new HashMap<String, Integer>(); 
	public static void main(String[] args) {
		HashMap<String, Integer> hashMap = new HashMap<String, Integer>(); 
		
		HashMap<String, Integer> map=new HashMap<String, Integer>(); 
		//BufferedReader br = null;
		//FileReader fr = null;
		
		try (BufferedReader br = new BufferedReader(new FileReader(FILENAME))) {

			String sCurrentLine;
			String key;
			Integer value1;

			while ((sCurrentLine = br.readLine()) != null) {
				System.out.println(sCurrentLine);
				//String text = brTest.readLine();
				// Stop. text is the first line.
				//System.out.println(text);
				String[] strArray = sCurrentLine.split("\\s");
				System.out.println(strArray[0]);
				System.out.println(strArray[1]);
				System.out.println(strArray[2]);
				System.out.println(Arrays.toString(strArray));
				//HashMap<String, Integer> hashMap = new HashMap<String, Integer>(); 
				key = strArray[1];
				value1 = Integer.parseInt(strArray[2]);
				
				//hashMap.put(33, 22);
				map.put(key, value1);
				
				//System.out.println(map); 
				
				//hashMap.add(value);
			    //hashMap.remove(0);  
			    //System.out.println(hashMap); 
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("Total documents: " + map.size());
		
		TreeMap<String, Integer> sortedMap = sortMapByValue(map);  
		/*for (String key : sortedMap.keySet()) {
            System.out.println(key + " : " + sortedMap.values()); // why null values here?
        }
        */
		//System.out.print("key is: "+ sortedMap.getKey() + " & Value is: "+ sortedMap.getValue());
        //System.out.println(sortedMap.getValue());
		System.out.println(sortedMap);
		//System.out.println(sortedMap);
		
		
		 //Set  set =new HashSet();
		
		 /*Set set = map.entrySet();
	     Iterator iterator = set.iterator();
	     while(iterator.hasNext()) {
	         Map.Entry mentry = (Map.Entry)iterator.next();
	         System.out.print("key is: "+ mentry.getKey() + " & Value is: ");
	         System.out.println(mentry.getValue());
	      }
	      
	      */
		//System.out.println(hashMap); 
		//System.out.println("Hello! World");
	    //for(Entry<String, Integer> entry: map.entrySet()) {
	    //    System.out.println(entry.getKey());
	    //    System.out.println(entry.getValue());
	    //}
		
	}
	
	public static TreeMap<String, Integer> sortMapByValue(HashMap<String, Integer> map){
		Comparator<String> comparator = new ValueComparator(map);
		//TreeMap is a map sorted by its keys. 
		//The comparator is used to sort the TreeMap by keys. 
		TreeMap<String, Integer> result = new TreeMap<String, Integer>(comparator);
		result.putAll(map);
		return result;
	}

}

class ValueComparator implements Comparator<String>{
	 
	HashMap<String, Integer> map = new HashMap<String, Integer>();
 
	public ValueComparator(HashMap<String, Integer> map){
		this.map.putAll(map);
	}
 
	@Override
	public int compare(String s1, String s2) {
		if(map.get(s1) >= map.get(s2)){
			return -1;
		}else{
			return 1;
		}	
	}
}



