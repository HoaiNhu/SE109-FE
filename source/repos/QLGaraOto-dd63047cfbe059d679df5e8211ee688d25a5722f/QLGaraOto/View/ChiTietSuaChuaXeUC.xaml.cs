using QLGaraOto.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace QLGaraOto.View
{
    /// <summary>
    /// Interaction logic for ChiTietSuaChuaXeUC.xaml
    /// </summary>
    public partial class ChiTietSuaChuaXeUC : UserControl
    {
        public ChiTietSuaChuaXe ViewModel { get; set; }
        public ChiTietSuaChuaXeUC()
        {
            InitializeComponent();
            this.DataContext = ViewModel=new ChiTietSuaChuaXe();
        }
    }
}
