// For Directory.GetFiles and Directory.GetDirectories 
// For File.Exists, Directory.Exists 
using System;
using System.IO;
using System.Collections;

namespace ConsoleApplication1
{
    public class RecursiveFileProcessor
    {
        public static void Main(string[] args)
        {
            string path = "D:\\resource";



            RecursiveDirectory d = new RecursiveDirectory();

            if (File.Exists(path))
            {
                // This path is a file
                d.ProcessFile(path);
            }
            else if (Directory.Exists(path))
            {
                // This path is a directory
                d.ProcessDirectory(path);
            }
            else
            {
                Console.WriteLine("{0} is not a valid file or directory.", path);
            }
            Console.WriteLine("Done!");
            Console.ReadLine();
        }


    }
}