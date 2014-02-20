/**
 * 
 */
package com.exedosoft.plat.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

/**
 * @author Administrator
 * 
 */
public class ASCII2NATIVE {

	/**
	 * 
	 */
	public ASCII2NATIVE() {
		// TODO Auto-generated constructor stub
	}

	public static void main(String[] args) {
		File f = new File("d:\\backup.sql");
		File f2 = new File("d:\\a2.sql");
		if (f.exists() && f.isFile()) {
			// convert param-file
			BufferedReader br = null;
			StringBuffer sb = new StringBuffer();
			String line;


			try
			{
				br = new BufferedReader(new InputStreamReader(new FileInputStream(f), "JISAutoDetect"));
				String bakInsert = "";
				
				boolean flag = false;
				
				while ((line = br.readLine()) != null)
				{

					if (line.startsWith("INSERT INTO "))
					{
						flag = false;
						
						bakInsert = line.replaceAll("PUBLIC.", "").replaceAll(" CONDITION,", " \"condition\",");
						
						bakInsert = bakInsert.replaceAll(" ISNULL,", " \"isnull\",");
					}
					
					if (line.contains("DO_BO_ICON") || line.contains("ff8080813ef9fe0a013f1329a8020307") || flag)
					{
						flag = true;
						continue;
					}
					
					if (line.startsWith("('"))
					{

						String str = ascii2Native(line);

						str = str.replaceAll("\\s", " ").replaceAll("\\r", " ").replaceAll("\\n", " ").replaceAll("PUBLIC.", "").replaceAll("'true'", "1").replaceAll("TRUE,", "1,").replaceAll("'false'", "0").replace("\\r\\n", " ").replace("STRINGDECODE", "").replaceAll(" CONDITION,", "\"condition\",");

						char dot = ',';
						if (str.charAt(str.length() - 1) == dot)
						{
							str = str.substring(0, str.length() - 1);
						}
						sb.append(bakInsert).append(" ").append(str)

						.append(";\n");

						System.out.println(str);

					}
				}

				BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(f2), "utf-8"));
				out.append(sb.toString());
				out.flush();
				out.close();
			}
			catch (FileNotFoundException e)
			{
				System.err.println("file not found - " + f);
			}
			catch (IOException e)
			{
				System.err.println("read error - " + f);
			}
			finally
			{
				try
				{
					if (br != null) br.close();
				}
				catch (Exception e)
				{
				}
			}
		} else {
			// // convert param-data
			// System.out.print(ascii2native(args[i]));
			// if (i + 1 < args.length)
			// System.out.print(' ');
		}
	}

	/**
	 * prefix of ascii string of native character
	 */
	private static String PREFIX = "\\u";

	/**
	 * Native to ascii string. It's same as execut native2ascii.exe.
	 * 
	 * @param str
	 *            native string
	 * @return ascii string
	 */
	public static String native2Ascii(String str) {
		char[] chars = str.toCharArray();
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < chars.length; i++) {
			sb.append(char2Ascii(chars[i]));
		}
		return sb.toString();
	}

	/**
	 * Native character to ascii string.
	 * 
	 * @param c
	 *            native character
	 * @return ascii string
	 */
	private static String char2Ascii(char c) {
		if (c > 255) {
			StringBuilder sb = new StringBuilder();
			sb.append(PREFIX);
			int code = (c >> 8);
			String tmp = Integer.toHexString(code);
			if (tmp.length() == 1) {
				sb.append("0");
			}
			sb.append(tmp);
			code = (c & 0xFF);
			tmp = Integer.toHexString(code);
			if (tmp.length() == 1) {
				sb.append("0");
			}
			sb.append(tmp);
			return sb.toString();
		} else {
			return Character.toString(c);
		}
	}

	/**
	 * Ascii to native string. It's same as execut native2ascii.exe -reverse.
	 * 
	 * @param str
	 *            ascii string
	 * @return native string
	 */
	public static String ascii2Native(String str) {
		StringBuilder sb = new StringBuilder();
		int begin = 0;
		int index = str.indexOf(PREFIX);
		while (index != -1) {
			sb.append(str.substring(begin, index));
			sb.append(ascii2Char(str.substring(index, index + 6)));
			begin = index + 6;
			index = str.indexOf(PREFIX, begin);
		}
		sb.append(str.substring(begin));
		return sb.toString();
	}

	/**
	 * Ascii to native character.
	 * 
	 * @param str
	 *            ascii string
	 * @return native character
	 */
	private static char ascii2Char(String str) {
		if (str.length() != 6) {
			throw new IllegalArgumentException(
					"Ascii string of a native character must be 6 character.");
		}
		if (!PREFIX.equals(str.substring(0, 2))) {
			throw new IllegalArgumentException(
					"Ascii string of a native character must start with \"\\u\".");
		}
		String tmp = str.substring(2, 4);
		int code = Integer.parseInt(tmp, 16) << 8;
		tmp = str.substring(4, 6);
		code += Integer.parseInt(tmp, 16);
		return (char) code;
	}

}
