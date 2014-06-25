// *************************************************************************
// Source: http://msdn.microsoft.com/en-us/library/07wt70x2(v=vs.110).aspx
// *************************************************************************

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Excel = Microsoft.Office.Interop.Excel;

namespace ConsoleApplication1
{
    class RecursiveDirectory
    {

        // Process all files in the directory passed in, recurse on any directories  
        // that are found, and process the files they contain. 
        public void ProcessDirectory(string targetDirectory)
        {
            // Process the list of files found in the directory. 
            string[] fileEntries = Directory.GetFiles(targetDirectory);

            Boolean haveFile = false;

            if (fileEntries.Length > 0) haveFile = true;

            if (haveFile)
            {
                Excel.Application xlApp;
                Excel.Workbook xlWorkBook;
                Excel.Worksheet xlWorkSheet;
                object misValue = System.Reflection.Missing.Value;

                xlApp = new Excel.Application();
                xlWorkBook = xlApp.Workbooks.Add(misValue);

                xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.get_Item(1);


                int row = 1;

                foreach (string fileName in fileEntries)
                {
                    xlWorkSheet.Cells[row, 1] = Path.GetFileName(fileName);

                    row++;
                }
                string currentDirectory = targetDirectory + "\\Book1.xls";

                Console.WriteLine(currentDirectory);

                xlWorkBook.SaveAs(currentDirectory, Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
                xlWorkBook.Close(true, misValue, misValue);
                xlApp.Quit();

                Excel2.releaseObject(xlWorkSheet);
                Excel2.releaseObject(xlWorkBook);
                Excel2.releaseObject(xlApp);
            }
            // Recurse into subdirectories of this directory. 
            string[] subdirectoryEntries = Directory.GetDirectories(targetDirectory);
            foreach (string subdirectory in subdirectoryEntries)
                ProcessDirectory(subdirectory);
        }

        // Insert logic for processing found files here. 
        public void ProcessFile(string path)
        {
            if (Path.GetExtension(path) == ".png")
            {
                Console.WriteLine("Processed file '{0}'.", path);
            }
        }

    }
}
