// react_native_app/components/LangButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function LangButton() {
  const { locale, switchLanguage } = useLanguage();

  return (
    <TouchableOpacity
      onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')}
      style={{ padding: 8, backgroundColor: '#eee', borderRadius: 6, marginLeft: 10 }}
    >
      <Text>{locale === 'en' ? 'עברית' : 'EN'}</Text>
    </TouchableOpacity>
  );
}
