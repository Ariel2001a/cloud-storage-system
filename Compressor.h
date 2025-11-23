#ifndef COMPRESSOR_H
#define COMPRESSOR_H
#include <string>

using namespace std;

class Compressor{
    public:
        string static compress(const string& text);
        string static decompress(const string& compressedText);
};
#endif