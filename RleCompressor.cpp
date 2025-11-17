#include <string>
#include <fstream>
#include <iostream>
#include "RleCompressor.h"   
   
   std::string RleCompressor::compress(std::string& text){
        std::string compresssedText;
        int count=0;
        for(int i=0;i<text.length();i++){
             if (text[i] == ' ')
            {
                compresssedText+=' ';
                count=0;
                continue;
            }
            count++;
            if(text[i]!=text[i+1]){
                compresssedText+=std::to_string(count)+text[i];
                count=0;
            }

           
            
        }
        return compresssedText;
    }