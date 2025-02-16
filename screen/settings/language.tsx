import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import navigationStyle from '../../components/navigationStyle';
import loc, { saveLanguage } from '../../loc';
import { AvailableLanguages } from '../../loc/languages';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import alert from '../../components/Alert';
import { useTheme } from '../../components/themes';
import ListItem from '../../components/ListItem';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const Language: React.FC = () => {
  const { setLanguage, language } = useContext(BlueStorageContext);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(loc.getLanguage());
  const { setOptions } = useNavigation();
  const { colors } = useTheme();
  const stylesHook = StyleSheet.create({
    flex: {
      backgroundColor: colors.background,
    },
  });

  useEffect(() => {
    setOptions({ title: loc.settings.language });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const renderItem = ({ item }: { item: { label: string; value: string; isRTL: boolean } }) => {
    return (
      <ListItem
        onPress={() => {
          const currentLanguage = AvailableLanguages.find(l => l.value === selectedLanguage);
          saveLanguage(item.value).then(() => {
            setSelectedLanguage(item.value);
            setLanguage();
            if (currentLanguage && (currentLanguage.isRTL || item.isRTL)) {
              alert(loc.settings.language_isRTL);
            }
          });
        }}
        title={item.label}
        checkmark={selectedLanguage === item.value}
      />
    );
  };

  return (
    <FlatList
      style={[styles.flex, stylesHook.flex]}
      keyExtractor={(_item, index) => `${index}`}
      data={AvailableLanguages as { label: string; value: string; isRTL: boolean }[]}
      renderItem={renderItem}
      initialNumToRender={25}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
};
// @ts-ignore: Fix later
Language.navigationOptions = navigationStyle({}, opts => ({ ...opts, title: loc.settings.language }));

export default Language;
