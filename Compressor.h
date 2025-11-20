#ifndef COMPRESSOR_H
#define COMPRESSOR_H
#include <string>

using namespace std;

class Compressor{
    public:
        string compress(const string& text);
        string decompress(const string& compressedText);
};
#endif