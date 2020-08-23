export function scriptWord() {
  fetch(`https://chinese.gratis/flashcards/ax_flashcard.php?HSK=ALL`, {
    method: 'POST',
  });

  fetch(`https://chinese.gratis/characters/index.php?start=16`, {
    method: 'POST',
  })
  .then((res) => {
    return res.text();
  })
  .then((response) => {
    var txt = document.getElementById("div");
    txt.innerHTML = response;
  })

  const {count, wordList, ideogramList} = this.state;

  const ideogram = ideogramList.get(count);
  let formData = new FormData();
formData.append('q', ideogram.get('text'));
formData.append('champs', 'all');
  fetch(`https://chinese.gratis/chinese-dictionary/index.php`, {
    method: 'POST',
    body: formData
  })
  .then((res) => {
    return res.text();
  })
  .then((response) => {
    var ideog = document.getElementById("ideo");
    ideog.innerHTML = response;

    const ideo = ideog.querySelectorAll('#dico table[align="center"] tr td[lang="zh-py"]')[3].innerText.trim();
    const text = ideog.querySelectorAll('#dico table[align="center"] tr td[lang="zh-CN"]')[3].innerText.trim();
    const desc = ideog.querySelectorAll('#dico table[align="center"] tr td[class="tablignefr"]')[3].innerText.trim();
    console.log(ideo);
    console.log(text);
    console.log(desc);

    const filter =  wordList.filter(word => word.get('text') === ideo);
    if (filter.size) {
      console.log('already here');
      return;
    }

    console.log('post');
    // this.postWord({text: ideo, description: text, translation: desc});
    console.log('posted');
  });

  this.setState({
    count: count + 1,
  });
  ;
}

export async function scriptAll() {
  //https://chinese.gratis/characters/
  const {count, ideogramList} = this.state;
    var txt = document.getElementById("div");

    const element = txt.querySelectorAll('[style="margin-top:30px"] > div')[count];
    

    if (!element.attributes.onclick) {
      return;
    }
    const url = element.attributes.onclick.value.replace("sendData('", '').match(/[a-z_.?=%0-9A-Z]*/g)[0];

    fetch(`https://chinese.gratis/characters/${url}`, {
      method: 'POST',
    })
    .then((res) => {
      return res.text();
    })
    .then((response) => {
      var ideog = document.getElementById("ideo");
      ideog.innerHTML = response;
      const text = ideog.getElementsByClassName('ccp')[0].textContent.trim();
      const desc = ideog.getElementsByClassName('ccf')[0].textContent.trim();
      const ideo = element.getElementsByClassName('ccn1')[0].innerText
      console.log(ideo);
      console.log(text);
      console.log(desc);

      const filter = ideogramList.filter(ideogram => ideogram.get('text') === ideo);
      if (filter.size) {
        console.log('already here');
        return;
      }

      console.log('post');
      this.postIdeogram({text: ideo, description: text, translation: desc});
      console.log('posted');
    });

    this.setState({
      count: count + 1,
    });
}

export function scriptIdeo() {
  const { ideogramList } = this.state;

  fetch(`https://chinese.gratis/flashcards/ax_flashcard.php?next=1`, {
    method: 'POST',
  });

  fetch(`https://chinese.gratis/flashcards/ax_flashcard.php?flip=1`, {
    method: 'POST',
  })
  .then((res) => {
    return res.text();
})
  .then((response) => {
    var txt = document.getElementById("div");
    txt.innerHTML = response;

    const pinyin = txt.getElementsByClassName('pinyin')[0].textContent;
    const ideo = txt.querySelectorAll('[style="text-align:center;font-size:40px"]')[0].textContent.replace('trad.', '');
    const desc = txt.querySelectorAll('div > div:nth-child(3)')[0].innerText.replace(pinyin, '').substr(3);
    console.log(pinyin);
    console.log(ideo);
    console.log(desc);

    const filter = ideogramList.filter(ideogram => ideogram.get('text') === ideo);
    if (filter.size) {
      console.log('already here');
      return;
    }

    console.log('post');
    this.postWord({text: ideo, description: pinyin, translation: desc});
    console.log('posted');
  });
}

export function script() {
  fetch(`https://en.wiktionary.org/wiki/Appendix:Mandarin_Frequency_lists/9001-10000`, {
    method: 'GET',
  }).then((res) => {
    return res.text();
  }).then((response) => {
    var ideog = document.getElementById("ideo");
  ideog.innerHTML = response;

    document.getElementById("ideo").querySelectorAll('tr').forEach((tr, index) => {
      if (index !== 0) {
        var ideo = tr.querySelectorAll('.Hans')[0].textContent.trim();
      var pinyin = tr.querySelectorAll('.Latn')[0].textContent.trim();
      var desc = tr.querySelectorAll('td:last-child')[0].textContent.trim();

      if (this.state.wordList.filter(word => word.get('text') === ideo).size === 0) {
        console.log(ideo, pinyin, desc);
        this.postWord({text: ideo, description: pinyin, translation: desc});
      }
      

      // this.postWord({text: ideo, description: pinyin, translation: desc});
      }
      
    });
    // debugger;
  });
}